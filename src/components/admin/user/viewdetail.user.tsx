import {  Drawer ,Descriptions,Avatar   } from 'antd';
import dayjs from "dayjs";
//import type { DescriptionsProps } from 'antd';
//import { useState } from 'react';
import {FORMATE_DATE} from '@/services/helper'
type IProps = {
  openViewDetail : boolean,
  setOpenViewDetail: (v:boolean)=>void,
  dataViewDetail: IUserTable|null,
  setDataViewDetail:(v: IUserTable | null)=>void
  
}

const ViewDetailUser=({openViewDetail,setOpenViewDetail,dataViewDetail,setDataViewDetail}:IProps)=>{
    const urlAvatar=`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataViewDetail?.avatar}`
    const onClose=()=>{
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }
    return(
        <>
            <Drawer
                title="Basic Drawer"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={openViewDetail}
                width={'50vw'}
            >
                <Descriptions bordered  title="Thông tin chi tiết người dùng ">
                    <Descriptions.Item label="ID" span={2}>{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên hiển thị" span={2}>{dataViewDetail?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email"span={2}>{dataViewDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại "span={2}>{dataViewDetail?.avatar}</Descriptions.Item>
                    <Descriptions.Item label="Role"  span={2}>{dataViewDetail?.role}</Descriptions.Item>
                    <Descriptions.Item label="Avatar" span={2}>
                        <Avatar shape="square" size={50}  src={urlAvatar} > </Avatar>
                    </Descriptions.Item>
                    <Descriptions.Item label="CreateAt "span={2} >{dayjs(dataViewDetail?.createAt).format(FORMATE_DATE)}</Descriptions.Item>
                    <Descriptions.Item label="UpdateAt"span={2}>{dayjs(dataViewDetail?.upDateAt).format(FORMATE_DATE)}</Descriptions.Item>
                </Descriptions>;
            </Drawer>
        </>
    )
}
export default ViewDetailUser