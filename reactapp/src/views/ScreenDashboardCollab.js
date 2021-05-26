import React,{useState,useEffect} from 'react';
import '../App.css';
import {Divider,Badge,Card,Row,Col,Menu,Space,Progress,Input,Form,List,Avatar,Tag,Typography,Modal,Image, message, Popconfirm,Popover,Search} from 'antd'
import { SendOutlined,HistoryOutlined,EditOutlined,EyeOutlined,LockOutlined,PlusOutlined,UserAddOutlined, DeleteOutlined} from '@ant-design/icons';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import opinions from '../post.svg'
import reading from '../reading.svg'
import searching from '../searching.svg'

function ScreenDashboardCollab(props) {

    const [visible, setVisible] = useState(false);
    const [seeListen,setSeeListen] = useState({reponse1: "", reponse2: "", reponse3: "", reponse4: "", reponse5: ""})
    const [seeFeedback,setSeeFeedback] = useState({feedback1: "", feedback2: ""})
    const [seeMood,setSeeMood] = useState(0)
   
    const [listenToDo,setListenToDo] = useState(false)
    const [listenToSee,setListenToSee] = useState(false)
    const [pageLoaded, setPageLoaded] = useState(false)

    const { SubMenu } = Menu;
    var styleListenToDo;
    var styleListenToSee;

    //----- Au chargement de la page fetch en BDD pour voir si listen à faire et à voir
    useEffect( async () => {
            var rawResponse = await fetch(`/find-listen?id=${props.user._id}`);
            var foundListen = await rawResponse.json();
           
            if (foundListen.listenToDo){
            setListenToDo(true)
            }
            if (foundListen.listenToSee){
            setListenToSee(true)  
            } 
            setPageLoaded(true)      
        }, [])

    //------- Au changement de l'état 'listenToDo' fetch en BDD pour voir si listen à faire et à voir pour permettre le temps réel
        useEffect( async () => {
            var rawResponse = await fetch(`/find-listen?id=${props.user._id}`);
            var foundListen = await rawResponse.json();
            
            if (foundListen.listenToDo){
            setListenToDo(true)
            }
            if (foundListen.listenToSee){
            setListenToSee(true)  
            } 
            setPageLoaded(true)    
        }, [listenToDo])

 //------- Au changement du store rerender pour voir si listen à faire et à voir pour permettre le temps réel
    useEffect(()=>{
    },[props.user])
/// ----- Gestion affichage/style card listen à faire
    if (listenToDo) {
        styleListenToDo = (<Link to="/listen" >
          <Badge count={1}>
          <Card
        hoverable
        className='card'
        cover={<img alt="Faire mon listen" style={{height:'215px'}} src={opinions}/>}
      >
        <Card.Meta title="Faire mon listen"  />
      </Card>
      </Badge>
        </Link>)
    } else {
      styleListenToDo =(<Card
      className='card-disabled'
      cover={<img style={{height:'215px'}} alt="Faire mon listen" src={opinions}/>}
    >
      <Card.Meta description="Pas de listen à faire pour le moment"  />
    </Card>)
    }
/// ----- Gestion affichage/style card listen à voir
    if (listenToSee) {
        styleListenToSee = (<Card hoverable onClick={async() => {await getSeeListen(props.user._id);showModal()}} 
        className='card'
        cover={<img style={{height:'215px'}} alt="Voir mon listen" src={reading}/>}>
        <Card.Meta title="Voir mon listen"  />
       </Card>)
    } else {
        styleListenToSee = (<Card 
        className='card-disabled'
        cover={<img style={{height:'215px'}} alt="Voir mon listen" src={reading}/>}>
        <Card.Meta description="Listen incomplet"  />
       </Card>)
    }

    //----------Gestion Modal pour voir son listen
    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
      setVisible(false);
  };
  //------Fetch en BDD pour récuperer les reponses collab et manager pour affichage dans modal
    var getSeeListen = async (value) => {
        var Response = await fetch(`/see-listen?collab=${value}`);
        var listens = await Response.json();
        setSeeListen(listens.answers)
        setSeeFeedback(listens.feedbacks)
        setSeeMood(listens.listenCompleted.mood)
    }

    

    if(!props.user.email){return (<Redirect to='/'/>)}
    if(props.user.type === 'manager'){
        (<Redirect to='/dashboard'/>)
    } else {
     if (pageLoaded){
      return (
    <div style={{background: `linear-gradient(180deg, #FFFFFF, #00BFA6 90%, #00a38d)`, height:'100vh', minHeight: '100vh'}}>
              <Menu mode="horizontal" className="navbar">
       <img src={'./logo-transparent.png'} className='navLogo'></img>
       <span style={{marginLeft:'6px'}}>Hey Listen ! </span>
          <SubMenu style={{position:'absolute', top:'0', right:'0'}} key="SubMenu" 
            icon={<Avatar className='avatarCollab' size={33}>{props.user.firstName[0]}{props.user.lastName[0]}</Avatar>}
          >
            <Menu.Item key="déconnexion" onClick={() => {props.handleClickLogOut()}}>Me déconnecter</Menu.Item>
            <Menu.Item key="informations personnelles"><Link to="/informations-personnelles">Informations personnelles</Link></Menu.Item>
          </SubMenu>
      </Menu>

      <Row gutter={[20, 24]} justify='center' align= 'middle' style={{height:'75%', width:'100%'}}>
        <Col span={6}>
       {styleListenToDo}
       </Col>
        <Col span={6}>
        {styleListenToSee}
       </Col>
        <Col span={6}>
        <Link to="/historique-collab" >
        <Card hoverable 
        className='card'
        cover={<img alt="Mon historique" style={{height:'215px'}} src={searching}/>}>
        <Card.Meta title="Mon historique"  />
       </Card>
       </Link>
       </Col>
       
      </Row>
      <Modal style={{borderRadius:100}} width= {1200} height= {900} visible={visible} footer={null} onCancel={handleCancel}>
                    <Row>
                    <Col span={6} offset={1}>
                    <h3 style={{color:'#00BFA6'}}>Feedback Manager</h3>
                    <Divider/>
                    </Col>
                    <Col span={14} offset={2}>
                    <h3 style={{color:'#00BFA6'}}>Votre Listen</h3>
                    <Divider/>
                    </Col>
                    </Row>
                    <Row>
                        <Col span={7} offset={1}>
                    
                    <h4>Qu'avez-vous pensé de la performance de ce collaborateur ?</h4>
                    <p style={{color:'#00BFA6'}}>{seeFeedback.feedback1}</p>
                    <h4>Qu'attendez-vous de ce collaborateur pour le mois prochain ?</h4>
                    <p style={{color:'#00BFA6'}}>{seeFeedback.feedback2}</p>
                    </Col>
                    <Col span={7} offset={1}>
                    
                    <h4>Humeur : {seeMood}</h4>
                    
                    <h4 >Les points positifs de la période:</h4>
                    <p style={{color:'#00BFA6'}}>{seeListen.reponse1}</p>
                    <h4>Quelles ont été les difficultés de la période ?</h4>
                    <p style={{color:'#00BFA6'}}>{seeListen.reponse2}</p>
                    
                    <h4>Mon objectif prioritaire pour le mois prochain:</h4>
                    <p style={{color:'#00BFA6'}}>{seeListen.reponse3}</p>
                    </Col>
                    <Col span={7} offset={1}> 
                    <h4>Qu'attends-je de mon manager pour le mois prochain ?</h4>
                    <p style={{color:'#00BFA6'}}>{seeListen.reponse4}</p>
                    <h4>Un point sur lequel j'aimerais revenir:</h4>
                    <p style={{color:'#00BFA6'}}>{seeListen.reponse5}</p>
                    </Col>
                    </Row>
                </Modal>
    </div>
    );
} else {
    return (
        <Row justify="center" align="middle" style={{height:'100vh'}}>
            <Col ><img src='./Spinner-1s-200px-vert.gif'/></Col>
        </Row>
   )
    }
}
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
)(ScreenDashboardCollab);

