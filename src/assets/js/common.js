export function toast(that, type, info) {
    that.$message({
        message: info,
        type: type
    });
}