import React,{useEffect,useState} from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import '../App.css';
import {Menu, Avatar, Badge} from 'antd';
import { SettingOutlined} from '@ant-design/icons';

function Nav(props) {
  const [listenToDo,setListenToDo] = useState("")

  const { SubMenu } = Menu;

  useEffect( async () => {
    if (props.shownModal == false){
        var rawResponse = await fetch(`/find-listen?id=${props.user._id}`);
        var foundListen = await rawResponse.json();
        var badge
        if (foundListen.response == true){
          badge = <Menu.Item key="listen">
                    <Badge dot >
                      <Link to="/listen" >Faire mon Listen</Link>
                    </Badge>
                  </Menu.Item>
        }else{
          badge = <Menu.Item key="listen">
                    <Link to="/listen" >Faire mon Listen</Link>
                  </Menu.Item>
        }
    }
    },[])

  useEffect(()=>{
  },[props.user])
  if(!props.user){return (<Redirect to='/'/>)}
  
  if(props.user.type==="manager"){
  return (
    <Menu mode="horizontal" className="navbar">
      <img src={'./logo-transparent.png'} className='navLogo'></img>
      <Menu.Item key="équipe">
        <Link to="/dashboard" >Mon équipe</Link>
      </Menu.Item>
      <Menu.Item key="historique">
        <Link to="/historique-manager" >Historique</Link>
      </Menu.Item>
      <Menu.Item key="listen">
        <Badge dot >
          <Link to="/listen" >Faire mon Listen</Link>
        </Badge>
      </Menu.Item>
        <SubMenu style={{position:'absolute', top:'0', right:'0'}} key="SubMenu" 
        icon={
            <Avatar className="avatar" size={33}>{props.user.firstName[0]}{props.user.lastName[0]}</Avatar>
        }>
            <Menu.Item key="déconnexion" onClick={() => props.handleClickLogOut()}>Me déconnecter</Menu.Item>
            <Menu.Item key="informations personnelles"><Link to="/informations-personnelles">Informations personnelles</Link></Menu.Item>
        </SubMenu>
    </Menu>
  )
  }else{
    return (
      <Menu mode="horizontal" className="navbar">
        <img src={'./logo-transparent.png'} className='navLogo'></img>
        <Menu.Item key="historique">
          <Link to="/historique-manager" >Historique</Link>
        </Menu.Item>
        {<Menu.Item key="listen">
          <Badge dot >
            <Link to="/listen" >Faire mon Listen</Link>
          </Badge>
        </Menu.Item>}
          <SubMenu style={{position:'absolute', top:'0', right:'0'}} key="SubMenu" 
          icon={
              <Avatar className="avatar" size={33}>{props.user.firstName[0]}{props.user.lastName[0]}</Avatar>
          }>
              <Menu.Item key="déconnexion" onClick={() => props.handleClickLogOut()}>Me déconnecter</Menu.Item>
              <Menu.Item key="informations personnelles"><Link to="/informations-personnelles">Informations personnelles</Link></Menu.Item>
          </SubMenu>
      </Menu>
    )
  };
}

function mapDispatchToProps(dispatch){
  return {
    handleClickLogOut: function(){
      dispatch({type:"logOut"})
    }
  }
}

function mapStateToProps(state){
  return {user: state.user}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Nav);