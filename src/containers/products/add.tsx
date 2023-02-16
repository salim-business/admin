import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Col, Form, Input, Modal, Row, Select, Upload } from 'antd'
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
            imgIds: [],
            streamIds: [],
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
                path: '/products',
                data: xtend(this.state.data, {
                    imgIds: this.state.imgIds,
                    attachment: this.state.attachment,
                    streamIds: this.state.streamIds,
                }),
            })
                .then(() => {
                    alert('Item has been added')
                    // message.success(
                    //     `Driver ${
                    //         this.props.data.id ? 'updated' : 'added'
                    //     } sucessfully`
                    // )
                    this.props.emitRootKeyChanged()
                    this.setState({
                        isModalVisible: false,
                    })
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
            if (info.fileList.length < 10) {
                this.setState({
                    limit: false,
                })
            }

            this.deletePathData({
                path: `/gfsUpload/${info.file.response.streamId}`,
            })

            console.log(this.state.streamIds, 'stre')

            this.setState({
                streamIds: this.state.streamIds.filter(function (id: any) {
                    return id !== info.file.response.streamId
                }),
            })

            console.log(this.state.streamIds)

            this.deletePathData({
                path: `/attachment/${info.file.response.filename}`,
            })

            console.log(this.state.imgIds, 'img')

            this.setState({
                imgIds: this.state.imgIds.filter(function (id: any) {
                    return id !== info.file.response.filename
                }),
            })

            console.log(this.state.imgIds)
        }

        if (info.file.status === 'uploading') {
            this.setState({ loading: true })
            return
        }

        if (info.file.status === 'done') {
            console.log(info.file, 'done......................')
            console.log(info)

            this.setState({
                imgIds: [...this.state.imgIds, info.file.response.filename],
            })

            this.setState({
                streamIds: [
                    ...this.state.streamIds,
                    info.file.response.streamId,
                ],
            })

            console.log(info.file.response.attachmentId._id)
            this.setState({ attachment: info.file.response.attachmentId._id })

            this.getBase64(info.file.originFileObj, (imageUrl: any) =>
                this.setState({
                    imageUrl,
                    loading: false,
                })
            )
            if (info.fileList.length >= 10) {
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
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
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
                            imgIds: [],
                            streamIds: [],
                        })
                        this.setData('category', '')
                        this.setData('name', '')
                        this.setData('cost', '')
                        this.setData('description', '')
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
                                    showUploadList={true}
                                    // fileList={this.state.fileList}
                                    action={`${this.apiManager.getApiUrl()}/gfsUpload`}
                                    // beforeUpload={beforeUpload}
                                    onChange={this.handleChange}
                                    headers={{
                                        'X-Access-Token': authToken,
                                    }}
                                    multiple
                                >
                                    {!this.state.limit
                                        ? uploadButton
                                        : undefined}
                                </Upload>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        label="Catergory"
                                        required={!this.props.data}
                                    >
                                        <Select
                                            placeholder="Category"
                                            // name="where"
                                            size="large"
                                            value={this.state.data.catergory}
                                            onChange={(value: any) =>
                                                this.setData('category', value)
                                            }
                                        >
                                            {['MEN', 'WOMEN'].map(
                                                (catergory, index) => (
                                                    <Select.Option
                                                        value={catergory}
                                                        key={index}
                                                    >
                                                        {catergory}
                                                    </Select.Option>
                                                )
                                            )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        label="VARIANT"
                                        required={!this.props.data}
                                    >
                                        <Select
                                            placeholder="Variant"
                                            // name="where"
                                            size="large"
                                            value={this.state.data.variant}
                                            onChange={(value: any) =>
                                                this.setData('variant', value)
                                            }
                                        >
                                            {[
                                                'Bags',
                                                'Jackets',
                                                'Trousers',
                                                'T-shirts',
                                                'Accesories',
                                            ].map((variant, index) => (
                                                <Select.Option
                                                    value={variant}
                                                    key={index}
                                                >
                                                    {variant}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        label="NAME OF ITEM"
                                        required={!this.props.data}
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Name"
                                            name="name"
                                            size="large"
                                            value={this.state.data.name}
                                            onChange={(e: any) =>
                                                this.setData(
                                                    'name',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        label="UNIT COST"
                                        required={!this.props.data}
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Cost"
                                            name="cost"
                                            size="large"
                                            value={this.state.data.cost}
                                            onChange={(e: any) =>
                                                this.setData(
                                                    'cost',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        label="Description"
                                        required={!this.props.data}
                                    >
                                        <Input.TextArea
                                            placeholder="DESCRIPTION"
                                            name="DESCRIPTION"
                                            size="large"
                                            value={this.state.data.description}
                                            onChange={(e: any) =>
                                                this.setData(
                                                    'description',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        label="Quantity"
                                        required={!this.props.data}
                                    >
                                        <Input
                                            type="number"
                                            placeholder="Number of pieces"
                                            name="stock"
                                            size="large"
                                            value={this.state.data.stock}
                                            onChange={(e: any) =>
                                                this.setData(
                                                    'stock',
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
