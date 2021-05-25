import React,{useEffect,useState} from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import '../App.css';
import {Avatar,Menu,Badge} from 'antd';


function Nav(props) {
  const [listenToDo,setListenToDo] = useState(false)
  const [listenToSee,setListenToSee] = useState(false)
  
  
  const { SubMenu } = Menu;

  useEffect( async () => {
    console.log("chargementnavbar")
        var rawResponse = await fetch(`/find-listen?id=${props.user._id}`);
        var foundListen = await rawResponse.json();
        console.log("finListenResponse", foundListen)
        if (foundListen.listenToDo){
        setListenToDo(true)
        if (foundListen.listenToSee){
        setListenToSee(true)  
        }
        
    }
    },[])

  useEffect(()=>{
  },[props.user])
 
  var badgeListenToDo
  if(listenToDo===false){badgeListenToDo={display:"none"}}
  var badgeListenToSee
  if(listenToSee===false){badgeListenToSee={display:"none"}}
  
  if(!props.user.email){console.log("if");return (<Redirect to='/'/>)}
  console.log('testtestrest',props.user)
  if(props.user.type==="manager"){ 
    return (
      <Menu style={{ position: 'fixed', zIndex: 1, width: '100%' }} mode="horizontal" className="navbar">
        <img src={'./logo-transparent.png'} className='navLogo'></img>
        <Menu.Item key="équipe">
          <Link to="/dashboard" >Mon équipe</Link>
        </Menu.Item>
        <Menu.Item key="historique">
          <Link to="/historique-manager" >Historique</Link>
        </Menu.Item>
        <SubMenu style={{position:'absolute', top:'0', right:'0'}} key="SubMenu" 
          icon={<Avatar className="avatar" size={33}>{props.user.firstName[0]}{props.user.lastName[0]}</Avatar>}
        >
          <Menu.Item key="déconnexion" onClick={() => props.handleClickLogOut()}>Me déconnecter</Menu.Item>
          <Menu.Item key="informations personnelles"><Link to="/informations-personnelles">Informations personnelles</Link></Menu.Item>
        </SubMenu>
      </Menu>
    )
  } else {
    return (
      <Menu style={{ position: 'fixed', zIndex: 1, width: '100%' }} mode="horizontal" className="navbar">
        <Link to="/dashboard-collab" ><img src={'./logo-transparent.png'} className='navLogo'></img></Link>
        <Menu.Item key="historique" >
          <Link to="/historique-collab" >Historique</Link>
        </Menu.Item>
        <Menu.Item disabled={!listenToDo} key="listen" >
          <Badge dot style={badgeListenToDo} >
            <Link to="/listen" >Faire mon Listen</Link>
          </Badge>
        </Menu.Item>
        <Menu.Item disabled={!listenToSee} key="listen" >
          <Badge dot style={badgeListenToSee} >
            <Link>Voir mon listen</Link>
          </Badge>
        </Menu.Item>
          <SubMenu style={{position:'absolute', top:'0', right:'0'}} key="SubMenu" 
            icon={<Avatar className="avatar" size={33}>{props.user.firstName[0]}{props.user.lastName[0]}</Avatar>}
          >
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