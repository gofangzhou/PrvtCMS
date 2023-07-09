String.prototype.format = function () {
    var args = arguments;
    if (args.length == 0)
        return this;
    if (args.length == 1 && typeof (args[0]) == "object") {
        var obj = args && args[0] instanceof Object ? args[0] : {};
        return this.replace(/[{\[]{1,2}([\u4e00-\u9fa5_0-9a-zA-Z~_.\[\]]+)[}\]]{1,2}/g, function (sh, re) {
            if (!/./.test(re))
                return obj[re] || sh;
            var rs = re.split(/[\[\].]/);
            var nj = obj;
            for (var i = 0; i < rs.length; i++) {
                if (!rs[i].length)
                    continue;
                if (nj === undefined)
                    return sh;
                nj = nj[rs[i]];
            }
            return nj;
        });
    }
    return this.replace(/{(\d+)}/g, function () {
        return args[arguments[1]];
    });
};
String.prototype.splitKeyWord = function (op = '、') {
    return this.split(op);
};