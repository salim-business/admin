import {
    CheckOutlined,
    DeleteOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, message, Popconfirm, Row, Table } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { IMobileComponent } from '../../models/ContainerProps'
import { emitRootKeyChanged } from '../../redux/actions/GlobalActions'
import ApiComponent from '../global/ApiComponent'
import CenteredSpinner from '../global/CenteredSpinner'
import ErrorRetry from '../global/ErrorRetry'
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
        products: any
        cafeOrders: any

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
            products: undefined,
            cafeOrders: undefined,

            unPaidOrders: undefined,
        }
    }

    onSearchUser(input: any, option: any) {
        let regEx = new RegExp(input, 'ig')
        return regEx.test(option.type)
    }

    reFetchData(isLoading: boolean) {
        this.setState({ isLoading }, () => {
            this.getPathData({ path: '/browse/cafeOrders' })
                .then(({ items }: any) => {
                    console.log(items, 'cafeOrders')

                    const paid = items.filter(
                        (e: any) => e.payment === 'successful'
                    )

                    const unpaid = items.filter(
                        (e: any) => e.payment !== 'successful'
                    )
                    this.setState({
                        isLoading: false,
                        apiData: items,
                        cafeOrders: items,
                        products: paid,
                        unPaidOrders: unpaid,
                    })

                    // this.props.emitRootKeyChanged()
                })
                .catch(() => this.setState({ isLoading: false }))
        })
    }

    componentDidMount() {
        this.reFetchData(true)
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
        this.getPathData({
            path: `/browse/products`,
        })
            .then(({ items }: any) => {
                // console.log(items, 'items')
                this.setState({
                    isLoading: false,
                    apiData: items,
                    products: items,
                })
            })
            .catch(() => this.setState({ isLoading: false }))

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
                                        INVENTORY
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
                            <Table
                                rowKey={(record) => record.id}
                                pagination={{
                                    defaultPageSize: 5,
                                    hideOnSinglePage: true,
                                    showSizeChanger: false,
                                }}
                                columns={[
                                    {
                                        title: 'PRODUCT',
                                        dataIndex: 'name',
                                    },
                                    {
                                        title: 'ITEM',
                                        dataIndex: 'imgIds',
                                        // dataIndex: 'original_name',
                                        render: (imgIds: any) => {
                                            return (
                                                <img
                                                    src={`${this.apiManager.getApiUrl()}/gfsUpload/preview/${
                                                        imgIds[0]
                                                    }`}
                                                    width={100}
                                                    height={100}
                                                />
                                            )
                                        },
                                    },
                                    {
                                        title: 'Quantity',
                                        dataIndex: 'stock',
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
                                                        this.deletePathData({
                                                            path: `/orders/${record._id}`,
                                                        }).then(() =>
                                                            this.props.emitRootKeyChanged()
                                                        )
                                                    }
                                                >
                                                    <Button
                                                        type="primary"
                                                        danger
                                                        shape="circle"
                                                        style={{
                                                            marginLeft: '10px',
                                                        }}
                                                        icon={
                                                            <DeleteOutlined />
                                                        }
                                                    />
                                                </Popconfirm>
                                                <Popconfirm
                                                    title="sure to approve?"
                                                    onConfirm={() => {
                                                        console.log(record)

                                                        this.updatePathData({
                                                            path: `/orders/${record._id}`,
                                                            data: {
                                                                status:
                                                                    'APPROVED',
                                                                confirmedAt: new Date(),
                                                            },
                                                        })
                                                            .then(() => {
                                                                this.props.emitRootKeyChanged()
                                                            })
                                                            .catch((e) => {
                                                                message.error(
                                                                    e.message
                                                                )
                                                            })
                                                    }}
                                                >
                                                    <Button
                                                        type="primary"
                                                        shape="circle"
                                                        style={{
                                                            marginLeft: '10px',
                                                        }}
                                                        icon={<CheckOutlined />}
                                                    />
                                                </Popconfirm>
                                            </span>
                                        ),
                                    },
                                ]}
                                // dataSource={this.state.cafeOrders}
                                dataSource={this.state.products}
                                size="small"
                            />
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
