import React,{useEffect} from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import '../App.css';
import {Menu, Avatar, Badge} from 'antd';
import { SettingOutlined} from '@ant-design/icons';

function Nav(props) {

  const { SubMenu } = Menu;

  useEffect(()=>{
  },[props.user])
  if(!props.user){return (<Redirect to='/'/>)}
  let inactive
  if(props.user.type==="collab"){inactive="disabled"}


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
      <span style={{marginLeft: '55%'}}>Bonjour {props.user.firstName}</span>
        <SubMenu key="SubMenu" title={
            <Avatar className="avatar" size={33}>{props.user.firstName[0]}{props.user.lastName[0]}</Avatar>
        }>
            <Menu.Item key="déconnexion" onClick={() => props.handleClickLogOut()}>Me déconnecter</Menu.Item>
            <Menu.Item key="informations personnelles">Informations personnelles</Menu.Item>
        </SubMenu>
    </Menu>

  );
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