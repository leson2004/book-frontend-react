import {useCurrentApp} from '@/components/context/app.context';

const Header=()=>{
    const {user}=useCurrentApp();
    return(
        <>
            <div> header {JSON.stringify(user)} </div>
        </>
    )
}
export default Header;