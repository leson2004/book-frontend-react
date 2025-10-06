import { useLocation } from 'react-router-dom';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
import { useCurrentApp } from "@/components/context/app.context"

type IProps={
    children: React.ReactNode
}
const ProtectedRoute =(props:IProps)=>{
    const location = useLocation();
    const {isAuthenticated,user}=useCurrentApp();
  
    if(isAuthenticated===false){
        return(
            <Result
                status="404"
                title="Not Login"
                subTitle="Bạn cần đăng nhập tài khoản để có thể truy cập "
                extra={<Button type="primary"><Link to="/login">Log in</Link></Button>}
            />
        )
    }
    const auth = location.pathname.includes('admin');
    if(isAuthenticated===true&&auth===true){
        if(user?.role==='USER'){
            return(
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Button type="primary"><Link to='/' >Back Home</Link></Button>}
                />
            )
        }
    }
        return (
            <>{props.children}</>
        )
}
export default ProtectedRoute