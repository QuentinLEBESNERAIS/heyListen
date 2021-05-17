import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import '../App.css';
import {Menu, Avatar, Badge} from 'antd';

function Nav() {

    return (
        <Menu mode="horizontal" className="navbar">
        <img src={'./logo-transparent.png'} className='navLogo'></img>
          <Menu.Item key="équipe">
            
            <Link to="/" >Mon équipe</Link>
          </Menu.Item>
  
          <Menu.Item key="historique">
           
            <Link to="/" >Historique</Link>
          </Menu.Item>
  
          <Menu.Item key="listen">
          <Badge dot >
            <Link to="/" >Faire mon Listen</Link>
            </Badge>
          </Menu.Item>
            <span className="rightSpans">
            <span>Michel Tichou</span>
            <span className="rightNavElement"><Avatar className="avatar" size={33}>MT</Avatar></span>
            </span>
        </Menu>
    );
  }

   export default connect(
    null,
    null
   )(Nav);