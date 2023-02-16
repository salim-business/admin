import { Col, Form, Input, message, Modal, Row, Select } from 'antd'
import React, { ReactElement } from 'react'
import { connect } from 'react-redux'
import xtend from 'xtend'
import { emitRootKeyChanged } from '../../redux/actions/GlobalActions'
import ApiComponent from '../global/ApiComponent'
import CenteredSpinner from '../global/CenteredSpinner'

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
            where: '',
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
                path: '/places',
                data: xtend(this.state.data),
            })
                .then((res) => {
                    console.log(res)
                    this.props.emitRootKeyChanged()
                    message.success(
                        `Driver ${
                            this.props.data.id ? 'updated' : 'added'
                        } sucessfully`
                    )
                    // this.props.emitRootKeyChanged()
                })
                .catch(() => {
                    this.setState({ isLoading: false })
                })
        })
    }

    render() {
        return (
            <>
                <Modal
                    title={`${this.props.data ? 'UPDATE' : 'NEW'} DRIVER`}
                    visible={this.state.isModalVisible}
                    onOk={this.add.bind(this)}
                    onCancel={() =>
                        this.setState({
                            isModalVisible: false,
                        })
                    }
                    okButtonProps={{ disabled: this.state.isLoading }}
                    cancelButtonProps={{ disabled: this.state.isLoading }}
                    okText={this.props.data ? 'UPDATE' : 'ADD'}
                >
                    {this.state.isLoading ? (
                        <CenteredSpinner />
                    ) : (
                        <Form layout="vertical">
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        label="WHERE"
                                        required={!this.props.data}
                                    >
                                        <Select
                                            placeholder="Where"
                                            // name="where"
                                            size="large"
                                            value={this.state.data.where}
                                            onChange={(value: any) =>
                                                this.setData('where', value)
                                            }
                                        >
                                            {['Hostel', 'Campus', 'Other'].map(
                                                (where, index) => (
                                                    <Select.Option
                                                        value={where}
                                                        key={index}
                                                    >
                                                        {where}
                                                    </Select.Option>
                                                )
                                            )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        label="NAME OF SPOT"
                                        required={!this.props.data}
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Spot"
                                            name="spot"
                                            size="large"
                                            value={this.state.data.spot}
                                            onChange={(e: any) =>
                                                this.setData(
                                                    'spot',
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
