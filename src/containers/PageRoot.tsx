import {
    BarsOutlined,
    ContactsOutlined,
    DashboardOutlined,
    FileAddOutlined,
    LogoutOutlined,
    RestOutlined,
    SettingOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons'
import { Button, Col, Layout, Menu, Row } from 'antd'
import React, { Fragment, RefObject } from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch } from 'react-router'
import { Link } from 'react-router-dom'
import ApiManager from '../api/ApiManager'
import * as GlobalActions from '../redux/actions/GlobalActions'
import StorageHelper from '../utils/StorageHelper'
import Banners from './banners'
import Dashboard from './Dashboard'
import ApiComponent from './global/ApiComponent'
import ClickableLink from './global/ClickableLink'
import DarkModeSwitch from './global/DarkModeSwitch'
import gridProducts from './gridProducts'
// import inventory from './inventory'
import LoggedInCatchAll from './LoggedInCatchAll'
import Orders from './orders'
import Places from './places'
import Products from './products'
import Settings from './settings'
import Staff from './staff'
import Users from './users'

const { Header, Content, Sider } = Layout

interface RootPageInterface extends RouteComponentProps<any> {
    rootElementKey: string
    emitSizeChanged: () => void
    isMobile: boolean
    isAdmin: boolean
}

class PageRoot extends ApiComponent<
    RootPageInterface,
    {
        collapsed: boolean
        me: any
    }
> {
    private mainContainer: RefObject<HTMLDivElement>

    constructor(props: any) {
        super(props)
        this.mainContainer = React.createRef()
        this.state = {
            collapsed: false,
            me: {},
        }
    }

    updateDimensions = () => this.props.emitSizeChanged()

    componentWillUnmount() {
        // @ts-ignore
        if (super.componentWillUnmount) super.componentWillUnmount()
        this.updateDimensions()
        window.removeEventListener('resize', this.updateDimensions)
    }

    componentDidUpdate(prevProps: any) {
        // Typical usage (don't forget to compare props):
        if (
            this.props.location.pathname !== prevProps.location.pathname &&
            this.props.isMobile
        ) {
            this.setState({ collapsed: true })
        }
    }
    componentDidMount() {
        const self = this
        this.updateDimensions()
        window.addEventListener('resize', this.updateDimensions)

        if (!ApiManager.isLoggedIn()) {
            this.goToLogin()
        } else {
            this.setState({
                collapsed: StorageHelper.getSiderCollapsedStateFromLocalStorage(),
            })
        }
    }

    goToLogin() {
        this.props.history.push('/login')
    }

    logout() {
        this.apiManager.setAuthToken('')
        StorageHelper.setAdmin(false)
        this.goToLogin()
    }

    createUpdateAvailableIfNeeded() {
        const self = this

        return (
            <Fragment>
                <ClickableLink
                    onLinkClicked={() => self.props.history.push('/settings')}
                ></ClickableLink>
            </Fragment>
        )
    }

    toggleSider = () => {
        StorageHelper.setSiderCollapsedStateInLocalStorage(
            !this.state.collapsed
        )
        this.setState({ collapsed: !this.state.collapsed })
    }

    render() {
        const self = this
        const MENU_ITEMS = [
            ...(this.props.isAdmin
                ? [
                      {
                          key: 'dashboard',
                          name: 'Dashboard',
                          icon: <DashboardOutlined rev/>,
                      },
                      {
                          key: 'orders',
                          name: 'ORDERS',
                          icon: <ShoppingCartOutlined rev/>,
                      },
                      //   {
                      //       key: 'users',
                      //       name: 'USERS',
                      //       icon: <TeamOutlined />,
                      //   },
                      {
                          key: 'products',
                          name: 'PRODUCTS',
                          icon: <RestOutlined rev/>,
                      },
                      {
                          key: 'gridProducts',
                          name: 'Grid PRODUCTS',
                          icon: <RestOutlined rev/>,
                      },
                      {
                          key: 'staff',
                          name: 'STAFF',
                          icon: <ContactsOutlined rev/>,
                      },
                      {
                          key: 'banners',
                          name: 'Banners',
                          icon: <FileAddOutlined rev/>,
                      },
                      //   {
                      //       key: 'inventory',
                      //       name: 'Inventory',
                      //       icon: <FileAddOutlined />,
                      //   },
                  ]
                : [
                      {
                          key: 'orders',
                          name: 'ORDERS',
                          icon: <ShoppingCartOutlined rev/>,
                      },
                      {
                          key: 'items',
                          name: 'PRODUCTS',
                          icon: <RestOutlined rev/>,
                      },
                      //   {
                      //       key: 'places',
                      //       name: 'PLACES',
                      //       icon: <CarOutlined />,
                      //   },
                      {
                          key: 'banners',
                          name: 'Banners',
                          icon: <FileAddOutlined rev/>,
                      },
                  ]),
            {
                key: 'settings',
                name: 'SETTINGS',
                icon: <SettingOutlined rev/>,
            },
        ]

        return (
            <Layout className="full-screen">
                <Header
                    className="header"
                    style={{
                        padding: `0 ${this.props.isMobile ? 15 : 50}px`,
                    }}
                >
                    <div>
                        <Row>
                            {this.props.isMobile && (
                                <Col span={4}>
                                    <Button
                                        ghost
                                        icon={<BarsOutlined rev/>}
                                        onClick={this.toggleSider}
                                    />
                                </Col>
                            )}
                            <Col lg={{ span: 12 }} xs={{ span: 20 }}>
                                <div>
                                    <h3 style={{ color: '#fff' }}>
                                        <img
                                            alt="logo"
                                            src={`${process.env.REACT_APP_API_URL}/igc-fashion-logo.png`}
                                            style={{
                                                height: 35,
                                                width: 35,
                                                marginRight: 10,
                                            }}
                                        />
                                        IGC FASHION ADMIN PANEL
                                    </h3>
                                </div>
                            </Col>
                            {!self.props.isMobile && (
                                <Col span={12}>
                                    <Row justify="end">
                                        <span
                                            style={{
                                                marginRight: 70,
                                            }}
                                        >
                                            <DarkModeSwitch />
                                        </span>
                                        <span>
                                            <span
                                                style={{
                                                    border: '1px solid #1b8ad3',
                                                    borderRadius: 5,
                                                    padding: 8,
                                                }}
                                            >
                                                <ClickableLink
                                                    onLinkClicked={this.logout.bind(
                                                        this
                                                    )}
                                                >
                                                    LOGOUT {` `}
                                                    <LogoutOutlined rev/>
                                                </ClickableLink>
                                            </span>
                                        </span>
                                    </Row>
                                </Col>
                            )}
                        </Row>
                    </div>
                </Header>

                <Layout>
                    <Sider
                        breakpoint="lg"
                        trigger={this.props.isMobile && undefined}
                        collapsible
                        collapsed={this.state.collapsed}
                        width={200}
                        collapsedWidth={self.props.isMobile ? 0 : 80}
                        style={{ zIndex: 2 }}
                        onCollapse={this.toggleSider}
                    >
                        <Menu
                            selectedKeys={[
                                this.props.location.pathname.substring(1),
                            ]}
                            theme="dark"
                            mode="inline"
                            defaultSelectedKeys={['users']}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            {MENU_ITEMS.map((item: any) =>
                                item.subitems?.length ? (
                                    <Menu.SubMenu
                                        key={item.key}
                                        icon={item.icon}
                                        title={item.name}
                                    >
                                        {item.subitems.map((subItem: any) => (
                                            <Menu.Item key={subItem.key}>
                                                <Link
                                                    to={`/${subItem.key}`}
                                                    className="nav-text"
                                                >
                                                    {subItem.name}
                                                </Link>
                                            </Menu.Item>
                                        ))}
                                    </Menu.SubMenu>
                                ) : (
                                    <Menu.Item key={item.key}>
                                        <Link
                                            to={`/${item.key}`}
                                            className="nav-text"
                                        >
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </Link>
                                    </Menu.Item>
                                )
                            )}

                            {this.props.isMobile && (
                                <Fragment>
                                    <div
                                        style={{
                                            backgroundColor:
                                                'rgba(255, 255, 255, 0.65)',
                                            height: 1,
                                            width: '80%',
                                            margin: '15px auto',
                                        }}
                                    />
                                    <div
                                        className="ant-menu-item"
                                        role="menuitem"
                                        style={{ paddingLeft: 24 }}
                                    >
                                        <ClickableLink
                                            onLinkClicked={this.logout.bind(
                                                this
                                            )}
                                        >
                                            <LogoutOutlined rev/>
                                            LOGOUT
                                        </ClickableLink>
                                    </div>
                                </Fragment>
                            )}
                        </Menu>
                    </Sider>
                    <Content>
                        <div
                            key={self.props.rootElementKey}
                            ref={self.mainContainer}
                            style={{
                                paddingTop: 12,
                                paddingBottom: 0,
                                height: '100%',
                                overflowY: 'scroll',
                                marginRight: self.state.collapsed
                                    ? 0
                                    : self.props.isMobile
                                    ? -200
                                    : 0,
                                transition: 'margin-right 0.3s ease',
                            }}
                            id="main-content-layout"
                        >
                            <Switch>
                                <Route
                                    path="/dashboard/"
                                    component={Dashboard}
                                />
                                <Route path="/users/" component={Users} />
                                <Route path="/staff/" component={Staff} />
                                <Route path="/orders" component={Orders} />
                                <Route path="/products" component={Products} />
                                <Route
                                    path="/gridProducts"
                                    component={gridProducts}
                                />
                                <Route path="/places" component={Places} />
                                <Route path="/banners" component={Banners} />
                                <Route path="/settings/" component={Settings} />
                                {/* <Route
                                    path="/inventory/"
                                    component={inventory}
                                /> */}
                                <Route path="/" component={LoggedInCatchAll} />
                            </Switch>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

function mapStateToProps(state: any) {
    return {
        rootElementKey: state.globalReducer.rootElementKey,
        isMobile: state.globalReducer.isMobile,
        isAdmin: StorageHelper.isAdmin(),
    }
}

export default connect(mapStateToProps, {
    emitSizeChanged: GlobalActions.emitSizeChanged,
})(PageRoot)
