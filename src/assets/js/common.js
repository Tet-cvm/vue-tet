export function onTips(that, type, info) {
    that.$message({
        message: info,
        type: type
    });
}