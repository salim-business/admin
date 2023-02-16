import { CheckOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd'
import axios from 'axios'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import ApiManager from '../../api/ApiManager'
import { emitRootKeyChanged } from '../../redux/actions/GlobalActions'
import StorageHelper from '../../utils/StorageHelper'

export default function ConfirmModal(props: any) {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [driver, setDriver] = useState('')
    const [amount, setAmount] = useState('')
    const [DbDrivers, setDbDrivers] = useState([{ name: 'failed to load' }])
    let authToken = StorageHelper.getAuthKeyFromStorage() || ''
    const dispatch = useDispatch()

    // useEffect(() => {
    //     // if (authToken) {
    //     //     TOKEN_HEADER = authToken
    //     // }
    //     axios({
    //         method: 'GET',
    //         url: `http://localhost:3001/api/v1/browse/drivers`,
    //         headers: {
    //             id: 'admin',
    //             isAdmin: true,
    //             isRoot: true,
    //             iat: 1630615475,
    //             'X-Access-Token': authToken,
    //         },
    //     }).then(async (res) => {
    //         console.log(res.data.items)
    //         await setDbDrivers(res.data.items)
    //         console.log(DbDrivers, 'drivers')
    //     })
    // }, [])
    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleOk = () => {
        if (props.order.type === 'Moving') {
            axios({
                method: 'PATCH',
                url: `${this.apiManager.getApiUrl()}/orders/${props.order.id}`,
                headers: {
                    // id: 'admin',
                    // isAdmin: true,
                    // isRoot: true,
                    // iat: 1630615475,
                    'X-Access-Token': authToken,
                },
            }).then((res) => {
                console.log(res)

                dispatch(emitRootKeyChanged())
            })
        } else {
            axios({
                method: 'PATCH',
                url: `${this.apiManager.getApiUrl()}/delivery/${
                    props.order.id
                }`,
                headers: {
                    // id: 'admin',
                    // isAdmin: true,
                    // isRoot: true,
                    // iat: 1630615475,
                    'X-Access-Token': authToken,
                },
            }).then((res) => {
                console.log(res, 'res')
                emitRootKeyChanged()
            })
        }
        setIsModalVisible(false)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }
    // console.log(props.order, 'props')

    return (
        <>
            {/* <Button type="primary" onClick={showModal}>
                Open Modal
            </Button> */}
            <Button
                onClick={() => {
                    axios({
                        method: 'GET',
                        url: `${this.apiManager.getApiUrl()}/browse/drivers`,
                        headers: {
                            id: 'admin',
                            isAdmin: true,
                            isRoot: true,
                            iat: 1630615475,
                            'X-Access-Token': ApiManager.getAuthTokenString(),
                        },
                    }).then(async (res) => {
                        console.log(res.data.items)
                        await setDbDrivers(res.data.items)
                        console.log(DbDrivers, 'drivers')
                    })
                    showModal()
                }}
                type="primary"
                shape="circle"
                style={{
                    marginLeft: '10px',
                }}
                icon={<CheckOutlined />}
            />
            <Modal
                title="Confirm Order"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form layout="vertical">
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col className="gutter-row" span={12}>
                            {/* <Form.Item label="Driver">
                                <Input
                                    type="text"
                                    placeholder="select Driver"
                                    name="name"
                                    size="large"
                                    value={driver}
                                    onChange={(e: any) =>
                                        setDriver(e.target.value)
                                    }
                                />
                            </Form.Item> */}
                            <Form.Item label="Driver">
                                <Select
                                    onChange={async (e: any) => {
                                        // console.log(e)
                                        await setDriver(e)
                                    }}
                                    value={driver}
                                    size="large"
                                    placeholder="select Driver"
                                >
                                    {DbDrivers.map((driver, index) => (
                                        <Select.Option
                                            value={driver.name}
                                            key={index}
                                        >
                                            {driver.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <Form.Item label="Amount">
                                <Input
                                    type="number"
                                    placeholder="Amount"
                                    name="username"
                                    size="large"
                                    value={amount}
                                    onChange={(e: any) =>
                                        setAmount(e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}
