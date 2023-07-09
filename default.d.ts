interface String {
    format: (...args: Object[]) => string
    splitKeyWord: (op = '、') => string[]
}

type TDataType = 'Null' | 'Undefined' | 'Object' | 'Array' | 'String' | 'Number' | 'Boolean' | 'Function' | 'RegExp' | 'NaN' | 'Infinity' | 'Date'

interface Object {
    checkDataType: (dataType: 'Null' | 'Undefined' | 'Object' | 'Array' | 'String' | 'Number' | 'Boolean' | 'Function' | 'RegExp' | 'NaN' | 'Infinity' | 'Date') => string
}