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
            vehicleSize: '',
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
                path: '/drivers',
                data: xtend(this.state.data),
            })
                .then(() => {
                    message.success(
                        `Driver ${
                            this.props.data.id ? 'updated' : 'added'
                        } sucessfully`
                    )
                    this.props.emitRootKeyChanged()
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
                                        label="NAME"
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
                                        label="USERNAME"
                                        required={!this.props.data}
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Username"
                                            name="username"
                                            size="large"
                                            value={this.state.data.username}
                                            onChange={(e: any) =>
                                                this.setData(
                                                    'username',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        label="PHONE NUMBER"
                                        required={!this.props.data}
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Phone number"
                                            name="phone"
                                            size="large"
                                            value={this.state.data.phone}
                                            onChange={(e: any) =>
                                                this.setData(
                                                    'phone',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        label="ADDRESS"
                                        required={!this.props.data}
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Address"
                                            name="address"
                                            size="large"
                                            value={this.state.data.address}
                                            onChange={(e: any) =>
                                                this.setData(
                                                    'address',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    {' '}
                                    <Form.Item
                                        label="VEHICLE"
                                        required={!this.props.data}
                                    >
                                        <Input
                                            type="text"
                                            placeholder="vehicle"
                                            name="vehicle"
                                            size="large"
                                            value={this.state.data.vehicle}
                                            onChange={(e: any) =>
                                                this.setData(
                                                    'vehicle',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    {' '}
                                    <Form.Item
                                        label="VEHICLE SIZE"
                                        required={!this.props.data}
                                    >
                                        <Select
                                            placeholder="Vehicle size"
                                            // name="vehicleSize"
                                            size="large"
                                            value={this.state.data.vehicleSize}
                                            onChange={(value: any) =>
                                                this.setData(
                                                    'vehicleSize',
                                                    value
                                                )
                                            }
                                        >
                                            {['small', 'medium', 'large'].map(
                                                (size, index) => (
                                                    <Select.Option
                                                        value={size}
                                                        key={index}
                                                    >
                                                        {size}
                                                    </Select.Option>
                                                )
                                            )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item label="LATITUDE">
                                        <Input
                                            placeholder="Latitude"
                                            size="large"
                                            type="number"
                                            value={this.state.data.latitude}
                                            onChange={(e: any) =>
                                                this.setData(
                                                    'latitude',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item label="LONGTUDE">
                                        <Input
                                            placeholder="Longtude"
                                            size="large"
                                            type="number"
                                            value={this.state.data.longtude}
                                            onChange={(e: any) =>
                                                this.setData(
                                                    'longtude',
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
