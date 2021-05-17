import React,{useState, useEffect} from 'react';
import {connect} from 'react-redux';
import { useParams } from "react-router-dom";
import { Card, Icon, Modal, Button} from 'antd';
import Nav from './Nav'

function ScreenSignUpManager(props) {

    return (
        <div className="background">
        <Nav/>

  </div>
    );
  }
  
  export default connect(
   null,
   null
  )(ScreenSignUpManager);
  