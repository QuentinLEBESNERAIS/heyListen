import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Col, Input, Row, Alert, Space, Button} from 'antd';
import {Link,Redirect} from 'react-router-dom';
import { set } from 'mongoose';

function ScreenSignUpCollab(props) {
const [firstName,setFirstName] = useState("")
const [lastName,setLastName] = useState("")
const [password,setPassword] = useState("")
const [password2,setPassword2] = useState("")
const [company,setCompany] = useState("")
const [jobTitle,setJobTitle] = useState("")
const [signUpError,setSignUpError] = useState("")
const [userCreated,setUserCreated] = useState(false)

var handleClickSignUp = ()=>{
  async function signUp(){
    
    var response = await fetch('/users/sign-up-collab',{
       method:"POST",
       headers:{'Content-Type':'application/x-www-form-urlencoded'},
       body:`email=${props.email}&firstName=${firstName}&lastName=${lastName}&password=${password}&password2=${password2}&company=${company}&jobTitle=${jobTitle}`
     })
     response=await response.json()
     console.log(response)
     setSignUpError(response.response)
     props.userToReducer(response.user)
     if(response.response==="compte crée"){setUserCreated(true)}

   }
   signUp()
}
if(userCreated){
  return <Redirect to="/historique-collab"/>
}

    return (
      <div className="background">
      <Row justify="center" align="middle" style={{height:'20%'}}>
      <Col span={16}>
      <Alert style={{borderRadius: '5px'}}
        message="Bienvenu ! Veuillez remplir les informations ci-dessous pour vous inscrire."
        type="warning"
        action={
    <Space>
       <Link to={'/'}>
      <Button size="small" type="ghost">
        Je suis déjà inscrit
      </Button>
      </Link>
    </Space>
  }
  closable
/>
      </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col span={16} align="middle" className="sign-up-title">
        Mes informations personnelles :
        </Col>
        </Row>
        <Row justify="center" align="top">
        <Col span={16}>
      <div className="sign-up-input-group"> 
      <Input value={lastName} onChange={(e)=>setLastName(e.target.value)} className="sign-up-inputs sign-up-top-input-width" placeholder="Nom" />
      <Input value={firstName} onChange={(e)=>setFirstName(e.target.value)} className="sign-up-inputs sign-up-top-input-width" placeholder="Prénom" />
      </div>
      <div className="sign-up-input-group"> 
      <Input value={password} onChange={(e)=>setPassword(e.target.value)} className="sign-up-inputs sign-up-top-input-width" placeholder="Mot de passe" />
      <Input value={password2} onChange={(e)=>setPassword2(e.target.value)} className="sign-up-inputs sign-up-top-input-width" placeholder="Confirmation du mot de passe" />
      </div>
      <div>
      <Input value={company} onChange={(e)=>setCompany(e.target.value)} className="sign-up-inputs sign-up-bottom-input-width" placeholder="Entreprise" />
      </div>
      <div>
      <Input value={jobTitle} onChange={(e)=>setJobTitle(e.target.value)} className="sign-up-inputs sign-up-bottom-input-width" placeholder="Intitulé du poste" />
      </div>
      </Col>
      </Row>
      <Row justify="center" align="center">
        <Col span={16} className="sign-up-button-div">
      <Button onClick={()=>handleClickSignUp()} className="sign-up-button">S'inscrire</Button>
      {signUpError}
      </Col>
      </Row>
    </div>
    );
  }
  
  function mapDispatchToProps(dispatch){
    return {
      userToReducer: function(user){
        dispatch({type:"logUser",user})
      }
    }
  }

  function mapStateToProps(state){
    return {email:state.email}
  }
  
  export default connect(mapStateToProps,mapDispatchToProps)(ScreenSignUpCollab)

  