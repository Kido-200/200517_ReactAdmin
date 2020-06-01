import React from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { reqDeleteImg } from '../../api';
import PropTypes from 'prop-types'

import {BASE_IMG_URL} from '../../utils/constants'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {

    static propTypes = {
        imgs:PropTypes.array
    }

    constructor(props){
        super(props)
        
        let fileList = []
        const {imgs} = this.props
        if(imgs&&imgs.length>0)
        {
            fileList = imgs.map((img,index) => ({
                uid:-index,
                name:img,
                status:'done',
                url:BASE_IMG_URL + img
            }))
        }

        this.state={
            previewVisible: false,//标识是否大图预览Modal
            previewImage: '',//大图的url
            previewTitle: '',
            fileList
            //   {
            //     uid: '-1',//每个file都要有一个唯一的id,建议设置为负数，防止和内部产生的id产生冲突
            //     name: 'image.png',//图片文件名
            //     status: 'done',//图片状态：done代表已经上传图片，uploading正在上传，error错误，removed已删除
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',//图片地址
            //   }
            ,
        }
    }


  //返回图片名称数组
  getImgs = () =>{
      return this.state.fileList.map(file => file.name)
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = async ({ file,fileList }) => {
      //fileList是所有已上传的图片数组
      //file是当前操作的文件，可能是上传，可能是删除
      console.log(file,fileList)
      //一旦上传成功，将当前上传的file信息修正(name,url)
      if(file.status==='done')
      {
          const result = file.response //status:0  data:{name:'xxx.jpg',url:'图片在服务器的地址'}
          if(result.status===0)
          {
              message.success('上传图片成功')
              //上传成功的话fileList里面是已经插入了
              const {name,url} = result.data
              //file和最后一个并不是同一个地址，虽然数据相同，我们想修改的是fileList里面的，所以要这么写
              file = fileList[fileList.length-1]
              file.name=name
              file.url = url
          }
          else{
              message.error('上传图片失败')
          }
      }
      else if(file.status==='removed')
      {
          const result = await reqDeleteImg(file.name)
          if(result.status===0)
          {
              message.success('删除图片成功')
          }
          else{
            message.error('删除图片失败')
          }
      }
    this.setState({ fileList });
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          accept='image/*'  //表示只接受图片
          action="/manage/img/upload" //表示上传图片的接口地址
          name='image'  //发送请求的参数名
          listType="picture-card"//图片显示样式
          fileList={fileList} //所以已上传图片文件对象的数组
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal 
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
