import React,{useEffect} from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import '../App.css';
import {Menu, Avatar, Badge, Dropdown, menu} from 'antd';

function Nav(props) {
  useEffect(()=>{
  },[props.user])

  if(!props.user){return (<Redirect to='/'/>)}

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
      <span className="rightSpans">
      <span>Bonjour {props.user.firstName}</span>
      <Dropdown overlay={menu} placement="bottomRight">
        <span onClick={() => props.handleClickLogOut()} className="rightNavElement"><Avatar className="avatar" size={33}>{props.user.firstName[0]}{props.user.lastName[0]}</Avatar></span>
      </Dropdown>
     
      </span>
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