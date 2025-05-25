export interface ProcessingProgress {
  stage: 'reading' | 'parsing' | 'indexing'
  progress: number
  recordsProcessed?: number
}

export class WebFileProcessor {
  static async processFile(
    file: File,
    onProgress?: (progress: ProcessingProgress) => void
  ): Promise<{
    recordCount: number
    contractAccountIndex: Map<string, number>
    loadTime: number
  }> {
    const startTime = Date.now()
    const contractAccountIndex = new Map<string, number>()
    let recordCount = 0

    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percentComplete = (event.loaded / event.total) * 100
          onProgress({
            stage: 'reading',
            progress: percentComplete * 0.3, // Reading is 30% of total progress
          })
        }
      }

      reader.onload = async (event) => {
        try {
          const text = event.target?.result as string
          
          // Update progress for parsing stage
          if (onProgress) {
            onProgress({
              stage: 'parsing',
              progress: 40,
            })
          }

          // Parse JSON in chunks to avoid blocking UI
          const records = JSON.parse(text)
          
          if (!Array.isArray(records)) {
            throw new Error('JSON file must contain an array of records')
          }

          recordCount = records.length

          // Index contract accounts
          if (onProgress) {
            onProgress({
              stage: 'indexing',
              progress: 60,
            })
          }

          // Process in batches to keep UI responsive
          const batchSize = 1000
          for (let i = 0; i < records.length; i += batchSize) {
            const batch = records.slice(i, i + batchSize)
            
            batch.forEach((record, batchIndex) => {
              const globalIndex = i + batchIndex
              if (record.contractAccount) {
                contractAccountIndex.set(record.contractAccount, globalIndex)
              }
            })

            if (onProgress) {
              const progress = 60 + (i / records.length) * 40
              onProgress({
                stage: 'indexing',
                progress,
                recordsProcessed: i,
              })
            }

            // Allow UI to update
            await new Promise(resolve => setTimeout(resolve, 0))
          }

          resolve({
            recordCount,
            contractAccountIndex,
            loadTime: Date.now() - startTime,
          })
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsText(file)
    })
  }

  static async getRecord(
    file: File,
    index: number
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          const text = event.target?.result as string
          const records = JSON.parse(text)
          
          if (index >= 0 && index < records.length) {
            resolve(records[index])
          } else {
            reject(new Error('Record index out of bounds'))
          }
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsText(file)
    })
  }

  static async searchRecords(
    file: File,
    searchType: 'contractAccount' | 'key' | 'value' | 'keyValue',
    searchTerm: string,
    keyName?: string,
    contractAccountIndex?: Map<string, number>
  ): Promise<{
    results: Array<{
      contractAccount: string
      recordIndex: number
      matchedKeys?: string[]
      matchedValues?: any[]
    }>
    searchTime: number
  }> {
    const startTime = Date.now()
    const results: Array<{
      contractAccount: string
      recordIndex: number
      matchedKeys?: string[]
      matchedValues?: any[]
    }> = []

    // Fast path for contractAccount search using index
    if (searchType === 'contractAccount' && contractAccountIndex) {
      const index = contractAccountIndex.get(searchTerm)
      if (index !== undefined) {
        results.push({
          contractAccount: searchTerm,
          recordIndex: index
        })
      }
      return {
        results,
        searchTime: Date.now() - startTime
      }
    }

    // For other search types, we need to scan all records
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          const text = event.target?.result as string
          const records = JSON.parse(text)

          records.forEach((record: any, index: number) => {
            const contractAccount = record.contractAccount || `Record ${index}`
            let matched = false
            const matchedKeys: string[] = []
            const matchedValues: any[] = []

            if (searchType === 'key') {
              // Search for key name
              const searchLower = searchTerm.toLowerCase()
              const checkObject = (obj: any, path: string = '') => {
                Object.keys(obj).forEach(key => {
                  const fullPath = path ? `${path}.${key}` : key
                  if (key.toLowerCase().includes(searchLower)) {
                    matched = true
                    matchedKeys.push(fullPath)
                    matchedValues.push(obj[key])
                  }
                  if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                    checkObject(obj[key], fullPath)
                  }
                })
              }
              checkObject(record)
            } else if (searchType === 'value') {
              // Search for value
              const searchLower = searchTerm.toLowerCase()
              const checkValue = (obj: any, path: string = '') => {
                Object.entries(obj).forEach(([key, value]) => {
                  const fullPath = path ? `${path}.${key}` : key
                  if (value !== null && value !== undefined) {
                    const valueStr = String(value).toLowerCase()
                    if (valueStr.includes(searchLower)) {
                      matched = true
                      matchedKeys.push(fullPath)
                      matchedValues.push(value)
                    }
                  }
                  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    checkValue(value, fullPath)
                  }
                })
              }
              checkValue(record)
            } else if (searchType === 'keyValue' && keyName) {
              // Search for specific key-value pair
              const checkKeyValue = (obj: any, path: string = '') => {
                Object.entries(obj).forEach(([key, value]) => {
                  const fullPath = path ? `${path}.${key}` : key
                  if (key === keyName || fullPath.endsWith(`.${keyName}`)) {
                    const valueStr = String(value)
                    if (valueStr === searchTerm || 
                        (typeof value === 'number' && value.toString() === searchTerm)) {
                      matched = true
                      matchedKeys.push(fullPath)
                      matchedValues.push(value)
                    }
                  }
                  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    checkKeyValue(value, fullPath)
                  }
                })
              }
              checkKeyValue(record)
            }

            if (matched) {
              results.push({
                contractAccount,
                recordIndex: index,
                matchedKeys,
                matchedValues
              })
            }
          })

          resolve({
            results,
            searchTime: Date.now() - startTime
          })
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsText(file)
    })
  }
}