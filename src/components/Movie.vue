<template>
    <div class="movie" ref="movie">
        <template>
            <div class="search" ref="search">
                <el-input placeholder="请输入ID,名称,主演" v-model="search" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="onSearch()"></el-button>
                </el-input>
                <div class="tag-group">
                    <el-tag
                        v-for="(item, index) in items"
                        :key="item.label"
                        :type="item.type"
                        effect="dark"
                        @click="onTag(index)">
                        {{ item.label }}
                    </el-tag>
                </div>
            </div>
            <div class="container">
                <template>
                    <el-table :data="movieData" style="width: 100%" :height="tableHeight + 'px'">
                        <el-table-column prop="id" label="序号" width="60px"></el-table-column>
                        <el-table-column prop="name" label="名称"></el-table-column>
                        <el-table-column label="海报">
                            <template slot-scope="scope">
                                <img :src="scope.row.img" />
                            </template>
                        </el-table-column>
                        <el-table-column label="主演" prop="star">
                            <template slot-scope="scope">
                                <span>{{ onFilter(scope.row.star, 1) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="类型" prop="series">
                            <template slot-scope="scope">
                                <span>{{ onFilter(scope.row.series, 2) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="score" label="评分" width="80px"></el-table-column>
                        <el-table-column prop="time" label="日期"></el-table-column>
                        <el-table-column label="操作" width="260px">
                            <template slot-scope="scope">
                                <el-button
                                size="mini"
                                type="success"
                                round
                                @click="handleAdd(scope.$index, scope.row)">新增</el-button>
                                <el-button
                                size="mini"
                                type="primary"
                                round
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button
                                size="mini"
                                type="danger"
                                round
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </div>
        </template>
        <!--【新增对话框】-->
        <el-dialog title="新增" :visible.sync="dialogAdd" top="18vh" :show-close="false" width="760px" custom-class="dialogAdd">
            <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="海报">
                            <el-upload
                            class="avatar-uploader"
                            action="/api/movie/upload"
                            enctype="multipart/form-data"
                            method="post"
                            name="image[]"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="addForm.imageUrl" :src="addForm.imageUrl" class="Avatar">
                            <i v-else class="el-icon-plus Avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="主演" prop="star">
                            <el-input type="text" placeholder="李小龙;李香凝" v-model="addForm.star"></el-input>
                        </el-form-item>
                        <el-form-item label="评分" prop="score">
                            <el-input type="score" placeholder="9.9" v-model="addForm.score"></el-input>
                        </el-form-item>
                        <el-form-item label="简介" prop="describe">
                            <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 12}" v-model="addForm.describe"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="名称" prop="name">
                            <el-input type="text" placeholder="将夜" v-model="addForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="类别" prop="series">
                            <el-checkbox-group v-model="addForm.series">
                                <el-checkbox label="院线"></el-checkbox>
                                <el-checkbox label="自制"></el-checkbox>
                                <el-checkbox label="动作"></el-checkbox>
                                <el-checkbox label="喜剧"></el-checkbox>
                                <el-checkbox label="科幻"></el-checkbox>
                                <el-checkbox label="犯罪"></el-checkbox>
                                <el-checkbox label="爱情"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item
                            v-for="(domain, index) in addForm.domains"
                            :label="'资源' + (index + 1)"
                            :key="domain.key"
                            :prop="'domains.' + index + '.value'"
                            :rules="{
                                required: true, message: '地址不能为空', trigger: 'blur'
                            }"
                            >
                            <el-row>
                                <el-col :span="21">
                                    <el-input v-model="domain.value"></el-input>
                                </el-col>
                                <el-col :span="3">
                                    <template v-if="index == 0">
                                        <i class="el-icon-plus" @click="addDomain(true)"></i>
                                    </template>
                                    <template v-if="index != 0">
                                        <i class="el-icon-minus" @click.prevent="removeDomain(domain, true)"></i>
                                    </template> 
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onAddSubmit('addForm')">立即创建</el-button>
                            <el-button @click="dialogAdd = false">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
        <!--【编辑对话框】-->
        <el-dialog title="新增" :visible.sync="dialogEdit" top="18vh" :show-close="false" width="760px" custom-class="dialogEdit">
            <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="海报">
                            <el-upload
                            class="avatar-uploader"
                            action="/api/movie/upload"
                            enctype="multipart/form-data"
                            method="post"
                            name="image[]"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="editForm.imageUrl" :src="editForm.imageUrl" class="Avatar">
                            <i v-else class="el-icon-plus Avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="主演" prop="star">
                            <el-input type="text" placeholder="李小龙;李香凝" v-model="editForm.star"></el-input>
                        </el-form-item>
                        <el-form-item label="评分" prop="score">
                            <el-input type="score" placeholder="9.9" v-model="editForm.score"></el-input>
                        </el-form-item>
                        <el-form-item label="简介" prop="describe">
                            <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 12}" v-model="editForm.describe"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="名称" prop="name">
                            <el-input type="text" placeholder="将夜" v-model="editForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="类别" prop="series">
                            <el-checkbox-group v-model="editForm.series">
                                <el-checkbox label="院线"></el-checkbox>
                                <el-checkbox label="自制"></el-checkbox>
                                <el-checkbox label="动作"></el-checkbox>
                                <el-checkbox label="喜剧"></el-checkbox>
                                <el-checkbox label="科幻"></el-checkbox>
                                <el-checkbox label="犯罪"></el-checkbox>
                                <el-checkbox label="爱情"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item
                            v-for="(domain, index) in editForm.domains"
                            :label="'资源' + (index + 1)"
                            :key="domain.key"
                            :prop="'domains.' + index + '.value'"
                            :rules="{
                                required: true, message: '地址不能为空', trigger: 'blur'
                            }"
                            >
                            <el-row>
                                <el-col :span="21">
                                    <el-input v-model="domain.value"></el-input>
                                </el-col>
                                <el-col :span="3">
                                    <template v-if="index == 0">
                                        <i class="el-icon-plus" @click="addDomain(false)"></i>
                                    </template>
                                    <template v-if="index != 0">
                                        <i class="el-icon-minus" @click.prevent="removeDomain(domain, false)"></i>
                                    </template> 
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onEditSubmit('editForm')">立即创建</el-button>
                            <el-button @click="dialogEdit = false">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
        <!--【删除对话框】-->
        <el-dialog title="警告" :visible.sync="dialogDel" top="30vh" :show-close="false" width="320px" custom-class="dialogDel">
            <span>你确定要删除该数据吗 ?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogDel = false">取 消</el-button>
                <el-button @click="onDelSubmit()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Movie',
    data() {
        return {
            search: '',
            select: 'aaa',
            tableHeight: '',
            movieData: [],
            items: [
                { type: 'primary', label: '院线' },
                { type: 'success', label: '自制' },
                { type: 'info', label: '动作' },
                { type: 'warning', label: '喜剧' },
                { type: 'danger', label: '科幻' },
                { type: 'primary', label: '犯罪' },
                { type: 'success', label: '爱情' }
            ],
            dialogAdd: false,
            addForm: {
                img: '',
                imageUrl: '',
                star: '',
                score: '',
                describe: '',
                name: '',
                series: [],
                domains: [{value: ''}],
            },
            addRules: {
                star: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
                ],
                score: [
                    { required: true, message: '请输入电影评分', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                describe: [
                    { required: true, message: '请输入电影简介', trigger: 'blur' },
                    { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入电影名称', trigger: 'blur' },
                    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
                ],
                series: [
                    { type: 'array', required: true, message: '请至少选择一个类别', trigger: 'change' }
                ]
            },
            dialogEdit: false,
            editForm: {
                id: Number,
                index: Number,
                img: '',
                imageUrl: '',
                star: '',
                score: '',
                describe: '',
                name: '',
                series: [],
                domains: [{value: ''}],
            },
            editRules: {
                star: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
                ],
                score: [
                    { required: true, message: '请输入电影评分', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                describe: [
                    { required: true, message: '请输入电影简介', trigger: 'blur' },
                    { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入电影名称', trigger: 'blur' },
                    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
                ],
                series: [
                    { type: 'array', required: true, message: '请至少选择一个类别', trigger: 'change' }
                ]
            },
            dialogDel: false,
            delForm: {
                index: Number,
                id: ''
            }
        }
    },
    created() {
        let that = this;
        that.$axios.post('/api/movie/list', {}, {})
        .then(function(res) {
            console.log(res, '/api/movie/list');
            if (res.data.length > 0) {
                that.movieData = res.data;
            } else {
                that.dialogAdd = true;
            }
        })
        .catch(function(err) {
            that.$toast(that, 'error', '网络错误～');
            that.loading = false;
        })
    },
    mounted() {
        let that = this;
        that.tableHeight = that.$refs.movie.offsetHeight - that.$refs.search.offsetHeight - 80;
    },
    methods: {
        onSearch() {
            let that = this;
            if (that.search) {
                let data = {
                    search: that.search
                }
                that.$axios.post('/api/movie/search', that.$qs.stringify(data), {})
                .then(function(res) {
                    console.log(res, '/api/movie/search');
                    if (res.data.status) {
                        that.movieData = res.data.data;
                        that.$toast(that, 'success', res.data.message);
                    } else {
                        that.$toast(that, 'error', res.data.message);
                    }
                })
                .catch(function(err) {
                    that.$toast(that, 'error', '网络错误～');
                    that.loading = false;
                })
            } else {
                that.$toast(that, 'error', '请输入内容～');
            }
        },
        onTag: function(index) {
            let that = this;
            let data = {
                tag: that.items[index].label
            }
            that.$axios.post('/api/movie/tag', that.$qs.stringify(data), {})
            .then(function(res) {
                console.log(res, '/api/movie/tag');
                if (res.data.status) {
                    that.movieData = res.data.data;
                    that.$toast(that, 'success', res.data.message);
                } else {
                    that.$toast(that, 'error', res.data.message);
                }
            })
            .catch(function(err) {
                that.$toast(that, 'error', '网络错误～');
            })
        },
        onFilter(data, type) {
            switch(type)
            {
                case 1:
                    let _star = data.split(';');
                    let str = '';
                    for(let i = 0; i<_star.length; i++) {
                        str += '[' + _star[i] + ']';
                    }
                    return str;
                    break;
                case 2:
                    console.log(data, '2222');
                    let list = '';
                    for (let i=0; i<data.length; i++) {
                        list += '[' + data[i] + ']';
                    }
                    return list;
                    break;
            }


        },
        addDomain(status) {
            status ? this.addForm.domains.push({value: '',key: Date.now()}) : this.editForm.domains.push({value: '',key: Date.now()});
        },
        removeDomain(item, status) {
            if (status) {
                var index = this.addForm.domains.indexOf(item)
                if (index !== -1) {
                    this.addForm.domains.splice(index, 1)
                }
            } else {
                var index = this.editForm.domains.indexOf(item)
                if (index !== -1) {
                    this.editForm.domains.splice(index, 1)
                }
            }
        },
        beforeAvatarUpload(file) {
            let that = this;
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                that.$toast(that, 'error', '上传头像图片只能是 JPG PNG 格式!');
                return;
            }
            if (!isLt2M) {
                that.$toast(that, 'error', '上传头像图片大小不能超过 2MB!');
                return;
            }
            return isJPG && isLt2M;
        },
        handleAvatarSuccess(res, file) {
            console.log(res, file, 'handleAvatarSuccess');
            if (this.dialogAdd) {
                this.addForm.img = res;
                this.addForm.imageUrl = URL.createObjectURL(file.raw);
            } else if (this.dialogEdit) {
                this.editForm.img = res;
                this.editForm.imageUrl = URL.createObjectURL(file.raw);
            }
        },
        handleAdd(index, row) {
            this.dialogAdd = true;
        },
        onAddSubmit(addForm) {
            let that = this;
            that.$refs[addForm].validate((valid)=>{
                if (valid) {
                    that.$axios.post('/api/movie/add', that.$qs.stringify(that.addForm), {})
                    .then(function(res){
                        console.log(res, '/api/movie/add');
                        if (res.data.status) {
                            that.dialogAdd = false;
                            that.movieData.push(res.data.data[0]);
                            that.$toast(that, 'success', res.data.message);
                            console.log(that.movieData, 'movieData');
                        } else {
                            that.$toast(that, 'error', res.data.message);
                        }
                    })
                    .catch(function(err) {
                        that.$toast(that, 'error', '网络错误～');
                    })
                } else {
                    return false;
                }
            })
        },
        handleEdit(index, row) {
            this.editForm.id = row.id;
            this.editForm.index = index;
            this.editForm.img = row.poster;
            this.editForm.imageUrl = row.img;
            this.editForm.star = row.star;
            this.editForm.score = row.score.toString();
            this.editForm.describe = row.describe;
            this.editForm.name = row.name;
            this.editForm.series = row.series;
            this.editForm.domains = row.domains;
            this.dialogEdit = true;
            console.log(index, row);
        },
        onEditSubmit(editForm) {
            let that = this;
            that.$refs[editForm].validate((valid)=>{
                if (valid) {
                    that.$axios.post('/api/movie/edit', that.$qs.stringify(that.editForm), {})
                    .then(function(res){
                        console.log(res, '/api/movie/edit');
                        if (res.data.status) {
                            that.dialogEdit = false;
                            that.movieData[that.editForm.index].img = res.data.data[0].img;
                            that.movieData[that.editForm.index].imageUrl = res.data.data[0].poster;
                            that.movieData[that.editForm.index].star = res.data.data[0].star;
                            that.movieData[that.editForm.index].score = res.data.data[0].score;
                            that.movieData[that.editForm.index].describe = res.data.data[0].describe;
                            that.movieData[that.editForm.index].name = res.data.data[0].name;
                            that.movieData[that.editForm.index].series = res.data.data[0].series;
                            that.movieData[that.editForm.index].domains = res.data.data[0].domains;
                            that.$toast(that, 'success', res.data.message);
                            console.log(that.movieData, 'movieData');
                        } else {
                            that.$toast(that, 'error', res.data.message);
                        }
                    })
                    .catch(function(err) {
                        that.$toast(that, 'error', '网络错误～');
                    })
                } else {
                    return false;
                }
            })
        },
        handleDelete(index, row) {
            console.log(index, row); 
            this.delForm.index = index;
            this.delForm.id = row.id;
            this.dialogDel = true;
        },
        onDelSubmit() {
            let that = this;
            let data = {
                'id': that.delForm.id
            }
            that.$axios.post('/api/movie/del', that.$qs.stringify(data), {})
            .then(function(res){
                console.log(res, '/api/movie/del');
                if (res.data.status) {
                    that.movieData.splice(that.delForm.index, 1);
                    that.dialogDel = false;
                    that.$toast(that, 'success', res.data.message);
                } else {
                    that.$toast(that, 'error', res.data.message);
                }
            })
            .catch(function(err) {
                that.$toast(that, 'error', '网络错误～');
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.movie {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #ffffff;
}
.search {
    margin: 38px 0 0 28px;
    width: 100%;
}
.search .tag-group {
    margin: 22px 0 0 0;
}
.search .tag-group .el-tag {
    margin: 0 18px 0 0;
}
.container {
    margin: 24px 0 0 0;
}
.container img {
    width: 38px;
    height: 38px;
}
.dialogAdd .el-col-3 {
    text-align: center;
}
.dialogEdit .el-col-3 {
    text-align: center;
}

</style>