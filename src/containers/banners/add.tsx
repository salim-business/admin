import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Col, Form, Input, Modal, Row, Upload, message } from 'antd'
import React, { ReactElement } from 'react'
import { connect } from 'react-redux'
import xtend from 'xtend'
import { emitRootKeyChanged } from '../../redux/actions/GlobalActions'
import StorageHelper from '../../utils/StorageHelper'
import ApiComponent from '../global/ApiComponent'
import CenteredSpinner from '../global/CenteredSpinner'

let authToken = StorageHelper.getAuthKeyFromStorage() || ''

class AddUser extends ApiComponent<
    {
        emitRootKeyChanged: Function
        children: ReactElement
        data: any
    },
    any
> {
    constructor(props: any) {
        super(props)
        this.state = {
            isLoading: false,
            isModalVisible: false,
            data: xtend(props.data, {}),
            loading: false,
            imageUrl: '',
            imgId: [],
            streamId: [],
            attachment: '',
            // fileList: [],
            limit: false,
        }
    }

    setData(key: any, value: any) {
        this.setState({
            data: xtend(this.state.data, {
                [`${key}`]: value,
            }),
        })
    }

    add() {
        this.setState({ isLoading: true }, () => {
            this[this.state.data.id ? 'updatePathData' : 'postPathData']({
                path: '/banners',
                data: xtend(this.state.data, {
                    imgId: this.state.imgId,
                    attachment: this.state.attachment,
                    streamId: this.state.streamId,
                }),
            })
                .then(() => {
                    // alert('Item has been added')
                    // message.success(
                    //     `Driver ${
                    //         this.props.data.id ? 'updated' : 'added'
                    //     } sucessfully`
                    // )
                    message.success('Banner added successfully')
                    this.setState({
                        isModalVisible: false,
                    })

                    this.props.emitRootKeyChanged()
                })
                .catch(() => {
                    this.setState({ isLoading: false })
                })
        })
    }

    getBase64(img: any, callback: any) {
        const reader = new FileReader()
        reader.addEventListener('load', () => callback(reader.result))
        reader.readAsDataURL(img)
        // console.log(reader.readAsDataURL(img), 'url')
    }

    handleChange = (info: any) => {
        if (info.file.status === 'removed') {
            this.setState({
                limit: false,
            })

            this.setState({
                loading: false,
            })

            this.deletePathData({
                path: `/gfsUpload/${info.file.response.streamId}`,
            })

            console.log(this.state.streamId, 'stre')

            this.setState({
                streamId: this.state.streamId.filter(function (id: any) {
                    return id !== info.file.response.streamId
                }),
            })

            console.log(this.state.streamId)

            this.deletePathData({
                path: `/attachment/${info.file.response.filename}`,
            })

            // console.log(this.state.imgIds, 'img')

            this.setState({
                imgId: '',
            })

            // console.log(this.state.imgIds)
        }

        if (info.file.status === 'uploading') {
            this.setState({ loading: true })
            return
        }

        if (info.file.status === 'done') {
            console.log(info.file, 'done......................')
            console.log(info)

            this.setState({
                imgId: info.file.response.filename,
            })

            this.setState({
                streamId: info.file.response.streamId,
            })

            console.log(info.file.response.attachmentId._id)
            this.setState({ attachment: info.file.response.attachmentId._id })

            this.getBase64(info.file.originFileObj, (imageUrl: any) =>
                this.setState({
                    imageUrl,
                    loading: false,
                })
            )
            if (info.fileList.length >= 1) {
                this.setState({
                    limit: true,
                })
            }
        }
    }

    render() {
        const { loading, imageUrl } = this.state
        const uploadButton = (
            <div>
                {loading ? <LoadingOutlined rev /> : <PlusOutlined rev />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        )
        return (
            <>
                <Modal
                    title={`${this.props.data ? 'UPDATE' : 'NEW'} ITEM`}
                    visible={this.state.isModalVisible}
                    onOk={this.add.bind(this)}
                    onCancel={() => {
                        this.setState({
                            isModalVisible: false,
                            imgId: '',
                            streamId: '',
                        })

                        this.setData('title', '')
                        this.setData('h5', '')
                        this.setData('text', '')
                    }}
                    okButtonProps={{ disabled: this.state.isLoading }}
                    cancelButtonProps={{ disabled: this.state.isLoading }}
                    okText={this.props.data ? 'UPDATE' : 'ADD'}
                >
                    {this.state.isLoading ? (
                        <CenteredSpinner />
                    ) : (
                        <Form layout="vertical">
                            <Row>
                                <Upload
                                    name="banner"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    // showUploadList={true}
                                    // fileList={this.state.fileList}
                                    action={`${this.apiManager.getApiUrl()}/gfsUpload`}
                                    // beforeUpload={beforeUpload}
                                    onChange={this.handleChange}
                                    headers={{
                                        'X-Access-Token': authToken,
                                    }}
                                    // multiple
                                >
                                    {!this.state.limit
                                        ? uploadButton
                                        : undefined}
                                </Upload>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        label="Big Heading"
                                        required={!this.props.data}
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Big Heading"
                                            name="name"
                                            size="large"
                                            value={this.state.data.title}
                                            onChange={(e: any) =>
                                                this.setData(
                                                    'title',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        label="Smaller heading"
                                        required={!this.props.data}
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Smaller heading"
                                            name="cost"
                                            size="large"
                                            value={this.state.data.h5}
                                            onChange={(e: any) =>
                                                this.setData(
                                                    'h5',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        label="Text below heading"
                                        required={!this.props.data}
                                    >
                                        <Input.TextArea
                                            placeholder="Text below heading"
                                            name="Text below heading"
                                            size="large"
                                            value={this.state.data.text}
                                            onChange={(e: any) =>
                                                this.setData(
                                                    'text',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Modal>
                {React.cloneElement(this.props.children, {
                    onClick: () => this.setState({ isModalVisible: true }),
                })}
            </>
        )
    }
}

export default connect<any, any, any>(undefined, {
    emitRootKeyChanged: emitRootKeyChanged,
})(AddUser)
