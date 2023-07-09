(Object as any).prototype.checkDataType = function (dataType: string) {
    return Object.prototype.toString.call(this) === `[object ${dataType}]`;
};