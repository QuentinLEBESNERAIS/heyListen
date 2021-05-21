import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Col, Input, Row, Alert, Space, Button, message} from 'antd';
import {Link,Redirect} from 'react-router-dom';

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
    var passwordReg = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i);
    var valid = passwordReg.test(password);
    if(!valid){setSignUpError("Le mot de passe est incorrect, il doit contenir au minimum 8 caractères dont une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial")
    }else{
      async function signUp(){
        var response = await fetch('/users/sign-up-collab',{
          method:"POST",
          headers:{'Content-Type':'application/x-www-form-urlencoded'},
          body:`email=${props.email}&firstName=${firstName}&lastName=${lastName}&password=${password}&password2=${password2}&company=${company}&jobTitle=${jobTitle}`
        })
        response = await response.json()
        console.log('response', response)
        var responseMail = await fetch('/mail/activate',{
          method:"POST",
          headers:{'Content-Type':'application/x-www-form-urlencoded'},
          body:`email=${props.email}&firstName=${firstName}&lastName=${lastName}&password=${password}&password2=${password2}&company=${company}&jobTitle=${jobTitle}`
        })
        setSignUpError(response.response)
        console.log('response.response', response.response)
        if(response.user)
        {props.userToReducer(response.user)
        if(response.response==="compte crée"){
          console.log('avant set état dans condition if')
          setUserCreated(true)
          const info = () => {
            message.info('Compte crée avec succès');
          }
          info();}}
      }
      console.log('fin de la fonction sign up')
    signUp()
    }
  }

  /*Alerte signUp*/
let alerte 
if(signUpError){alerte=<Alert style={{borderRadius: '5px'}}
message={signUpError}
type="error"
closable
/>}

  if(userCreated){
    console.log('avant redirect historique collab')
    return (<Redirect to="/historique-collab"/>)
  }
  return (
    <div className="background">
      <Row justify="center" align="middle" style={{height:'20%'}}>
        <Col span={16}>
          <Alert style={{borderRadius: '5px'}} message="Bienvenu ! Veuillez remplir les informations ci-dessous pour vous inscrire." type="warning"
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
          <div style={{color:'red'}}>
          {alerte}
          </div>
          <div className="sign-up-input-group"> 
            <Input rules={[{ required: true, message: 'Please input your username!' }]} value={lastName} onChange={(e)=>setLastName(e.target.value)} className="sign-up-inputs sign-up-top-input-width" placeholder="Nom" />
            <Input value={firstName} onChange={(e)=>setFirstName(e.target.value)} className="sign-up-inputs sign-up-top-input-width" placeholder="Prénom" />
          </div>
          <div className="sign-up-input-group"> 
            <Input.Password value={password} onChange={(e)=>setPassword(e.target.value)} className="sign-up-inputs sign-up-top-input-width" placeholder="Mot de passe" />
            <Input.Password value={password2} onChange={(e)=>setPassword2(e.target.value)} className="sign-up-inputs sign-up-top-input-width" placeholder="Confirmation du mot de passe"/>
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