import {
    DeleteOutlined,
    CheckOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, message, Popconfirm, Row, Table, Tabs } from 'antd'
import moment from 'moment-timezone'
import React from 'react'
import { connect } from 'react-redux'
import { IMobileComponent } from '../../models/ContainerProps'
import { emitRootKeyChanged } from '../../redux/actions/GlobalActions'
import ApiComponent from '../global/ApiComponent'
import CenteredSpinner from '../global/CenteredSpinner'
import ErrorRetry from '../global/ErrorRetry'
import ConfirmModal from './confirmModal'
import socket from '../../socket/socket'
// import User from './add'
// change colomn name to suit the orders

class UsersTable extends ApiComponent<
    {
        emitRootKeyChanged: Function
        isMobile: boolean
    },
    {
        searchTerm: string
        apiData: any
        isLoading: boolean
        confirmOrder: boolean
        movingOrders: any
        deliveryOrders: any
        orders: any
        paidOrders: any
        unPaidOrders: any
    }
> {
    constructor(props: any) {
        super(props)
        this.state = {
            searchTerm: '',
            apiData: undefined,
            isLoading: false,
            confirmOrder: false,
            movingOrders: undefined,
            deliveryOrders: undefined,
            orders: undefined,
            paidOrders: undefined,
            unPaidOrders: undefined,
        }
    }

    onSearchUser(input: any, option: any) {
        let regEx = new RegExp(input, 'ig')
        return regEx.test(option.type)
    }

    reFetchData(isLoading: boolean) {
        this.setState({ isLoading }, () => {
            this.getPathData({ path: '/browse/orders' })
                .then(({ items }: any) => {
                    console.log(items, 'orders')

                    const paid = items.filter(
                        (e: any) => e.payment === 'successful'
                    )

                    const unpaid = items.filter(
                        (e: any) => e.payment !== 'successful'
                    )
                    this.setState({
                        isLoading: false,
                        apiData: items,
                        orders: items,
                        paidOrders: paid,
                        unPaidOrders: unpaid,
                    })

                    // this.props.emitRootKeyChanged()
                })
                .catch(() => this.setState({ isLoading: false }))
        })
    }

    componentDidMount() {
        this.reFetchData(true)
        // setInterval(() => {
        //     this.reFetchData(false)
        // }, 5000)
        const conn = socket.connect()
        conn.on('conn', () => {
            console.log('socket connected')
        })
        conn.on('newOrder', () => {
            this.reFetchData(true)

            console.log('newOrder')
        })
    }

    render() {
        if (this.state.isLoading) return <CenteredSpinner />

        if (!this.state.apiData) {
            return <ErrorRetry reloadCallBack={this.reFetchData.bind(this)} />
        }

        // const data = this.state.apiData.filter((user: any) => {
        //     if (!this.state.searchTerm) return true
        //     return this.onSearchUser(this.state.searchTerm, user)
        // })

        // const searchAppInput = (
        //     <Input
        //         placeholder="Search"
        //         type="text"
        //         onChange={(event) =>
        //             this.setState({
        //                 searchTerm: (event.target.value || '').trim(),
        //             })
        //         }
        //     />
        // )

        return (
            <div>
                <Row justify="center">
                    <Col
                        xs={{ span: 23 }}
                        lg={{ span: 23 }}
                        style={{ paddingBottom: 300 }}
                    >
                        <Card
                            // extra={!this.props.isMobile && searchAppInput}
                            title={
                                <React.Fragment>
                                    <span>
                                        <ShoppingCartOutlined />
                                        {`  `} ORDERS
                                    </span>
                                    <br />
                                    {this.props.isMobile && (
                                        <div style={{ marginTop: 8 }}>
                                            {/* {searchAppInput} */}
                                        </div>
                                    )}
                                </React.Fragment>
                            }
                        >
                            <Tabs
                                onChange={(activeKey: any) => {
                                    // console.log(activeKey)
                                    this.getPathData({
                                        path: `/browse/${activeKey}`,
                                    })
                                        .then(({ items }: any) => {
                                            console.log(items, 'items')
                                            this.setState({
                                                isLoading: false,
                                                apiData: items,
                                                deliveryOrders: items,
                                            })
                                        })
                                        .catch(() =>
                                            this.setState({ isLoading: false })
                                        )
                                }}
                                defaultActiveKey="1"
                            >
                                <Tabs.TabPane tab="Paid" key="orders">
                                    <Table
                                        rowKey={(record) => record.id}
                                        pagination={{
                                            defaultPageSize: 5,
                                            hideOnSinglePage: true,
                                            showSizeChanger: false,
                                        }}
                                        columns={[
                                            {
                                                title: 'ITEM',
                                                dataIndex: 'name',
                                            },
                                            {
                                                title: 'Pcs',
                                                dataIndex: 'quantity',
                                            },
                                            {
                                                title: 'ADDRESS',
                                                dataIndex: 'country',
                                                // render: (_, record: any) =>
                                                //     record.address.locale,
                                            },
                                            {
                                                title: 'CITY',
                                                dataIndex: 'city',
                                                // render: (_, record: any) =>
                                                //     record.address.locale,
                                            },
                                            {
                                                title: 'CONTACT',
                                                dataIndex: 'contact',
                                            //     render: (_, record: any) =>
                                            //         record.userId.username,
                                            },
                                            // {
                                            //     title: 'PHONE',
                                            //     dataIndex: 'us',
                                            //     render: (_, record: any) =>
                                            //         record.userId.phone,
                                            // },
                                            {
                                                title: 'ORDERED AT',
                                                dataIndex: 'createdAt',
                                                render: (createdAt) => (
                                                    <>
                                                        {moment(createdAt)
                                                            .tz(
                                                                'Africa/Kampala'
                                                            )
                                                            .format(
                                                                'MMMM Do, h:mm a'
                                                            )}
                                                    </>
                                                ),
                                            },
                                            {
                                                title: 'PAYMENT',
                                                dataIndex: 'payment',
                                            },
                                            {
                                                title: 'STATUS',
                                                dataIndex: 'status',
                                            },
                                            {
                                                title: 'ACTION',
                                                dataIndex: 'actions',
                                                render: (_, record) => (
                                                    <span>
                                                        {/* <User data={record}>
                                                <Button
                                                    shape="circle"
                                                    type="primary"
                                                >
                                                    <EditOutlined />
                                                </Button>
                                            </User> */}
                                                        <Popconfirm
                                                            title="Sure to delete?"
                                                            onConfirm={() =>
                                                                this.deletePathData(
                                                                    {
                                                                        path: `/orders/${record._id}`,
                                                                    }
                                                                ).then(() =>
                                                                    this.props.emitRootKeyChanged()
                                                                )
                                                            }
                                                        >
                                                            <Button
                                                                type="primary"
                                                                danger
                                                                shape="circle"
                                                                style={{
                                                                    marginLeft:
                                                                        '10px',
                                                                }}
                                                                icon={
                                                                    <DeleteOutlined />
                                                                }
                                                            />
                                                        </Popconfirm>
                                                        <Popconfirm
                                                            title="sure to approve?"
                                                            onConfirm={() => {
                                                                console.log(
                                                                    record
                                                                )

                                                                this.updatePathData(
                                                                    {
                                                                        path: `/orders/${record._id}`,
                                                                        data: {
                                                                            status:
                                                                                'APPROVED',
                                                                            confirmedAt: new Date(),
                                                                        },
                                                                    }
                                                                )
                                                                    .then(
                                                                        () => {
                                                                            this.props.emitRootKeyChanged()
                                                                        }
                                                                    )
                                                                    .catch(
                                                                        (e) => {
                                                                            message.error(
                                                                                e.message
                                                                            )
                                                                        }
                                                                    )
                                                            }}
                                                        >
                                                            <Button
                                                                type="primary"
                                                                shape="circle"
                                                                style={{
                                                                    marginLeft:
                                                                        '10px',
                                                                }}
                                                                icon={
                                                                    <CheckOutlined />
                                                                }
                                                            />
                                                        </Popconfirm>
                                                    </span>
                                                ),
                                            },
                                        ]}
                                        // dataSource={this.state.orders}
                                        dataSource={this.state.orders}
                                        size="small"
                                    />
                                </Tabs.TabPane>

                                <Tabs.TabPane tab="POD" key="unpaid">
                                    <Table
                                        rowKey={(record) => record.id}
                                        pagination={{
                                            defaultPageSize: 5,
                                            hideOnSinglePage: true,
                                            showSizeChanger: false,
                                        }}
                                        columns={[
                                            {
                                                title: 'ITEM',
                                                dataIndex: 'item',
                                            },
                                            {
                                                title: 'Pcs',
                                                dataIndex: 'quantity',
                                            },
                                            {
                                                title: 'ADDRESS',
                                                dataIndex: 'address',
                                                render: (_, record: any) =>
                                                    record.address.locale,
                                            },
                                            {
                                                title: 'USER',
                                                dataIndex: 'userId',
                                                render: (_, record: any) =>
                                                    record.userId.username,
                                            },
                                            {
                                                title: 'PHONE',
                                                dataIndex: 'userId.phone',
                                                render: (_, record: any) =>
                                                    record.userId.phone,
                                            },
                                            {
                                                title: 'ORDERED AT',
                                                dataIndex: 'createdAt',
                                                render: (createdAt) => (
                                                    <>
                                                        {moment(createdAt)
                                                            .tz(
                                                                'Africa/Kampala'
                                                            )
                                                            .format(
                                                                'MMMM Do, h:mm a'
                                                            )}
                                                    </>
                                                ),
                                            },
                                            {
                                                title: 'PAYMENT',
                                                dataIndex: 'payment',
                                            },
                                            {
                                                title: 'STATUS',
                                                dataIndex: 'status',
                                            },
                                            {
                                                title: 'ACTION',
                                                dataIndex: 'actions',
                                                render: (_, record) => (
                                                    <span>
                                                        {/* <User data={record}>
                                                <Button
                                                    shape="circle"
                                                    type="primary"
                                                >
                                                    <EditOutlined />
                                                </Button>
                                            </User> */}
                                                        <Popconfirm
                                                            title="Sure to delete?"
                                                            onConfirm={() =>
                                                                this.deletePathData(
                                                                    {
                                                                        path: `/orders/${record._id}`,
                                                                    }
                                                                ).then(() =>
                                                                    this.props.emitRootKeyChanged()
                                                                )
                                                            }
                                                        >
                                                            <Button
                                                                type="primary"
                                                                danger
                                                                shape="circle"
                                                                style={{
                                                                    marginLeft:
                                                                        '10px',
                                                                }}
                                                                icon={
                                                                    <DeleteOutlined />
                                                                }
                                                            />
                                                        </Popconfirm>
                                                        <Popconfirm
                                                            title="sure to approve?"
                                                            onConfirm={() => {
                                                                console.log(
                                                                    record
                                                                )

                                                                this.updatePathData(
                                                                    {
                                                                        path: `/orders/${record._id}`,
                                                                        data: {
                                                                            status:
                                                                                'APPROVED',
                                                                            confirmedAt: new Date(),
                                                                        },
                                                                    }
                                                                )
                                                                    .then(
                                                                        () => {
                                                                            this.props.emitRootKeyChanged()
                                                                        }
                                                                    )
                                                                    .catch(
                                                                        (e) => {
                                                                            message.error(
                                                                                e.message
                                                                            )
                                                                        }
                                                                    )
                                                            }}
                                                        >
                                                            <Button
                                                                type="primary"
                                                                shape="circle"
                                                                style={{
                                                                    marginLeft:
                                                                        '10px',
                                                                }}
                                                                icon={
                                                                    <CheckOutlined />
                                                                }
                                                            />
                                                        </Popconfirm>
                                                    </span>
                                                ),
                                            },
                                        ]}
                                        // dataSource={this.state.orders}
                                        dataSource={this.state.unPaidOrders}
                                        size="small"
                                    />
                                </Tabs.TabPane>
                            </Tabs>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

function mapStateToProps(state: any) {
    return {
        isMobile: state.globalReducer.isMobile,
    }
}

export default connect<IMobileComponent, any, any>(mapStateToProps, {
    emitRootKeyChanged: emitRootKeyChanged,
})(UsersTable)
