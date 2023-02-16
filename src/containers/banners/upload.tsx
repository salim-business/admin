import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Upload } from 'antd'
import { connect } from 'react-redux'
// import xtend from 'xtend'
import { emitRootKeyChanged } from '../../redux/actions/GlobalActions'
import StorageHelper from '../../utils/StorageHelper'
import ApiComponent from '../global/ApiComponent'
let authToken = StorageHelper.getAuthKeyFromStorage() || ''

class UploadAvatar extends ApiComponent<any, any> {
    state = {
        loading: false,
        imageUrl: '',
    }

    handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true })
            return
        }
        if (info.file.status === 'done') {
            console.log('banners saved')
            // this.props.emitRootKeyChanged()
            //    this.setState({})
            // Get this url from response in real world.
        }
    }

    render() {
        const { loading, imageUrl } = this.state
        const uploadButton = (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        )
        return (
            <>
                <Upload
                    name="banner"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action={`${this.apiManager.getApiUrl()}/banners`}
                    headers={{
                        'X-Access-Token': authToken,
                    }}
                    // beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                    // onRemove={() => this.setState({ loading: true })}

                    // data={{ role: 'banner' }}
                >
                    {
                        //     imageUrl ? (
                        //     <img
                        //         src={imageUrl}
                        //         alt="avatar"
                        //         style={{ width: '100%' }}
                        //     />
                        // ) : (
                        uploadButton
                        // )
                    }
                </Upload>
            </>
        )
    }
}

// export default UploadAvatar

export default connect<any, any, any>(undefined, {
    emitRootKeyChanged: emitRootKeyChanged,
})(UploadAvatar)
