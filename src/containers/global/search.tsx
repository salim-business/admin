import { SearchOutlined } from '@ant-design/icons'
import { Select, Spin, Typography } from 'antd'
import React from 'react'
import shortUUID from 'short-uuid'
import xtend from 'xtend'
import ApiComponent from '../global/ApiComponent'

export default class SearchSelect extends ApiComponent<
    any,
    { apiData: any; fetching: boolean }
> {
    constructor(props: any) {
        super(props)
        this.state = {
            apiData: [],
            fetching: false,
        }
    }

    onSearch(value: any) {
        if (value.length) {
            this.setState({ fetching: true, apiData: [] }, () => {
                this.getPathData({
                    path: '/search',
                    query: xtend({ q: value }, this.props.query),
                })
                    .then((data: any) => {
                        this.setState({
                            fetching: false,
                            apiData: (function () {
                                if (data.items) return data.items

                                let grouped = new Array()

                                for (const key in data) {
                                    if (
                                        Object.prototype.hasOwnProperty.call(
                                            data,
                                            key
                                        )
                                    ) {
                                        grouped.push({
                                            label: key.toLocaleUpperCase(),
                                            grouped: true,
                                            options: data[key].items,
                                        })
                                    }
                                }

                                return grouped
                            })(),
                        })
                    })
                    .catch(() => {
                        this.setState({ fetching: false, apiData: [] })
                    })
            })
        } else {
            this.setState({ fetching: false, apiData: [] })
        }
    }

    render() {
        const OptionHtml = (opt: any) => {
            return (
                <div>
                    <Typography.Link>
                        {opt.fullName || opt.name || opt.id}
                    </Typography.Link>
                    {this.props.userList && (
                        <Typography.Text
                            style={{
                                display: 'block',
                            }}
                            type="secondary"
                        >
                            {opt.phone}
                        </Typography.Text>
                    )}
                </div>
            )
        }

        return (
            <Select
                showSearch
                filterOption={false}
                showArrow={false}
                onSearch={this.onSearch.bind(this)}
                placeholder={
                    <span>
                        <SearchOutlined /> {` `}
                        Please type to search
                    </span>
                }
                {...this.props}
                style={xtend({ width: '100%' }, this.props.style)}
                notFoundContent={
                    this.state.fetching ? (
                        <Spin size="small" tip="Searching, please wait..." />
                    ) : (
                        <span>No match found</span>
                    )
                }
            >
                {this.state.apiData.map((opt: any, index: any) =>
                    opt.grouped ? (
                        <Select.OptGroup
                            label={opt.label}
                            key={shortUUID.generate()}
                        >
                            {opt.options.map((subOpt: any, subIndex: any) => (
                                <Select.Option
                                    value={subOpt.id}
                                    key={shortUUID.generate()}
                                >
                                    <OptionHtml {...subOpt} />
                                </Select.Option>
                            ))}
                        </Select.OptGroup>
                    ) : (
                        <Select.Option value={opt.id} key={index}>
                            <OptionHtml {...opt} />
                        </Select.Option>
                    )
                )}
            </Select>
        )
    }
}
