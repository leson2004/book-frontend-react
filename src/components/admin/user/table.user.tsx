import { PlusOutlined ,DeleteOutlined,EditOutlined} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button,Pagination  } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { getUsersAPI } from '@/services/api';
import {dateRangeValidate} from '@/services/helper'

const columns: ProColumns<IUserTable>[] = [
    {

        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
             
        search: false,
        title: 'id',
        dataIndex: '_id',
        //width:200
        render(dom, entity, index, action, schema,) {
            return(
                <a>{entity._id}</a>
            )
        },
    },
    {
        
        title: 'Email ',
        dataIndex: 'email',
        copyable:true
       
    },
     {
        
        title: 'Full Name ',
        dataIndex: 'fullName',
        
       
    },
     {
        title: 'Create At',
        dataIndex: 'createRange',
        valueType: 'dateRange',
        hideInTable:true,
    },
    {
        title: 'Create At',
        dataIndex: 'createdAt',
        valueType: 'date',
        hideInSearch:true,
    },
     {
        search: false,
        title: 'Action',
        render: (text, record) => (
            <>
                <button style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer', 
                       
                    }}
                    onClick={()=> console.log(record)}
                >
                <DeleteOutlined style={{ fontSize: '16px', color: '#f57800' }}/>
                </button>
                <button 
                    style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer', 
                        
                    }}
                    onClick={()=> console.log(record)}
                >
                <EditOutlined style={{ fontSize: '16px', color: '#ff4d4f' }}/>
                </button>
            </>
        ),
    },
       // ở column có thể tạo 2 bảng created at và ẩn đi 
    // tạo 1 file để tạo hàm cofig date . trong request tham số params sẽ được gọi sau mỗi lần reset do vậy giá trị trên inout sẽ lấy được từ param 
    // từ đó sẽ tạo giá trị query là các kiểu api sẽ truyền vào với điều kiệ khác nhau sẽ api đc gửi và lấy dữ liệu khác nhau . 

    
];
type ISearch ={
    fullName:string;
    email:string;
    createdAt:string;
    createRange:string;

}
const TableUser = () => {
   // const [userPage,setUserPage]=useState<IModelPaginate<IUserTable>>();
    const [meta,setMeTa]=useState({
        current:1,
        pageSize:5,
        pages:0,
        total:0
    })
    const actionRef = useRef<ActionType>();
    
    return (
        <>
            <ProTable<IUserTable,ISearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params,sort, filter); // mỗi lần chạy bảng sẽ chạy qua hàm request này , tham số params sẽ lấy ra 
                    // giá trị currentPage và pageSize động .  
                    //let query=`api/v1/user?current=${params.current ?? 1}&pageSize=${params.pageSize ?? 5}`
                    // fullName : query=`${query}/fullName=${params.fullName}/i`
                    //email : query=`${query}/fullName=${params.fullName}/i`
                    //createAt : 
                    console.log('param',params);
                    let query='';
                    if(params){
                        query=`current=${params.current ?? 1}&pageSize=${params.pageSize ?? 5}`;
                        if(params.fullName){
                            query+=`&fullName=/${params.fullName}/i`
                        }
                        if(params.email){
                            query+=`&email=/${params.email}/i`
                        }
                        const createDateRange=dateRangeValidate(params.createRange);
                        if(createDateRange){
                            
                            query+=`&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`// tại sao có thể dùng key là 0,1 ??[startDate, endDate];
                        }
                    }
                    const res=await getUsersAPI(query);
                    if(res.data){
                        setMeTa(res.data.meta)
                    }
                    return {
                        // data: data.data,
                        data:res.data?.result,
                        "page": 1,
                        "success": true,
                        "total":res.data?.meta.total ,
                    }

                }}
                
              
                rowKey="_id"
                
                pagination={{
                    current: meta.current,
                    pageSize:meta.pageSize,
                    showSizeChanger: true,
                    total:meta.total,
                    showTotal:(total,range)=>{return(<div>{range[0]} -{range[1]} trên {total} rows</div>)}
                    
                    
                }}
                dateFormatter="string"
                headerTitle="Table user"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            actionRef.current?.reload();
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
        </>
    );
};

export default TableUser;