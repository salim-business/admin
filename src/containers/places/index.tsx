import {
    CarOutlined,
    DeleteOutlined,
    EditOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Input, Popconfirm, Row, Table } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { IMobileComponent } from '../../models/ContainerProps'
import { emitRootKeyChanged } from '../../redux/actions/GlobalActions'
import ApiComponent from '../global/ApiComponent'
import CenteredSpinner from '../global/CenteredSpinner'
import ErrorRetry from '../global/ErrorRetry'
import Driver from './add'

class UsersTable extends ApiComponent<
    {
        emitRootKeyChanged: Function
        isMobile: boolean
    },
    {
        searchTerm: string
        apiData: any
        isLoading: boolean
    }
> {
    constructor(props: any) {
        super(props)
        this.state = {
            searchTerm: '',
            apiData: undefined,
            isLoading: false,
        }
    }

    onSearchUser(input: any, option: any) {
        let regEx = new RegExp(input, 'ig')
        return regEx.test(option.spot)
    }

    reFetchData() {
        this.setState({ isLoading: true }, () => {
            this.getPathData({ path: '/browse/places' })
                .then(({ items }: any) => {
                    this.setState({ isLoading: false, apiData: items })
                    console.log('items', items)
                })
                .catch(() => this.setState({ isLoading: false }))
        })
    }

    componentDidMount() {
        this.reFetchData()
    }

    render() {
        if (this.state.isLoading) return <CenteredSpinner />

        if (!this.state.apiData) {
            return <ErrorRetry reloadCallBack={this.reFetchData.bind(this)} />
        }

        const dataToRender = this.state.apiData.filter((user: any) => {
            if (!this.state.searchTerm) return true
            return this.onSearchUser(this.state.searchTerm, user)
        })

        const searchAppInput = (
            <Input
                placeholder="Search"
                type="text"
                onChange={(event) =>
                    this.setState({
                        searchTerm: (event.target.value || '').trim(),
                    })
                }
            />
        )

        return (
            <Row justify="center">
                <Col
                    xs={{ span: 23 }}
                    lg={{ span: 16 }}
                    style={{ paddingBottom: 300 }}
                >
                    <Card
                        extra={!this.props.isMobile && searchAppInput}
                        title={
                            <React.Fragment>
                                <span>
                                    <CarOutlined rev/>
                                    {`  `}
                                    DRIVERS
                                </span>
                                <br />
                                {this.props.isMobile && (
                                    <div style={{ marginTop: 8 }}>
                                        {searchAppInput}
                                    </div>
                                )}
                            </React.Fragment>
                        }
                    >
                        <Table
                            rowKey="username"
                            pagination={{
                                defaultPageSize: 5,
                                hideOnSinglePage: true,
                                showSizeChanger: false,
                            }}
                            columns={[
                                {
                                    title: 'WHERE',
                                    dataIndex: 'where',
                                    sorter: (a: any, b: any) => {
                                        return a.where.localeCompare(b.where)
                                    },
                                    defaultSortOrder: 'ascend',
                                    sortDirections: ['descend', 'ascend'],
                                },

                                {
                                    title: 'SPOT',
                                    dataIndex: 'spot',
                                },
                                {
                                    title: 'PHONE',
                                    dataIndex: 'phone',
                                },
                                {
                                    title: 'ADDRESS',
                                    dataIndex: 'address',
                                },
                                {
                                    title: 'VEHICLE',
                                    dataIndex: 'vehicle',
                                },
                                {
                                    title: 'ACTIONS',
                                    dataIndex: 'actions',
                                    render: (_, record) => (
                                        <span>
                                            <Driver data={record}>
                                                <Button
                                                    shape="circle"
                                                    type="primary"
                                                >
                                                    <EditOutlined rev/>
                                                </Button>
                                            </Driver>
                                            <Popconfirm
                                                title="Sure to delete?"
                                                onConfirm={() =>
                                                    this.deletePathData({
                                                        path: `/places/${record.id}`,
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
                                                    icon={<DeleteOutlined rev/>}
                                                />
                                            </Popconfirm>
                                        </span>
                                    ),
                                },
                            ]}
                            dataSource={
                                // [{ username: 'Geo', roles: [], id: 'eft' }]
                                dataToRender
                            }
                            size="small"
                        />
                        <Driver>
                            <Button
                                type="primary"
                                style={{ marginTop: '15px' }}
                            >
                                <UsergroupAddOutlined rev/>
                                ADD
                            </Button>
                        </Driver>
                    </Card>
                </Col>
            </Row>
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
