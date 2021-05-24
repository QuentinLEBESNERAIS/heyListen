import React,{useState,useEffect} from 'react';
import '../App.css';
import {Divider,Button,Card,Row,Col,Menu,Space,Progress,Input,Form,List,Avatar,Tag,Typography,Modal,Image, message, Popconfirm,Popover,Search} from 'antd'
import { SendOutlined,HistoryOutlined,EditOutlined,EyeOutlined,LockOutlined,PlusOutlined,UserAddOutlined, DeleteOutlined} from '@ant-design/icons';
import {Link, Redirect} from 'react-router-dom'
import Nav from './Nav'
import {connect} from 'react-redux';
import {Line} from 'react-chartjs-2';
import { registerables } from 'chart.js';

function ScreenDashboardCollab(props) {

    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visible3, setVisible3] = useState(false);
    const [visible4, setVisible4] = useState(false);
    const[feedbackOne,setFeedbackOne] = useState('');
    const[feedbackTwo,setFeedbackTwo] = useState('');
    const [collabEmail,setCollabEmail] = useState ('');
    const [errorMessage, setErrorMessage] = useState('');
    const [team,setTeam] = useState([]);
    const[listenfromBack,setListenfromBack] = useState([]);
    const [feedbackfromBack,setFeedbackFromBack] = useState([])
    const [collabIDFeedback,setCollabIDFeedback] = useState('')
    const [idCollab, setIdCollab] = useState('')
    const [search,setSearch] = useState('')
    const [filteredTeam, setFilteredTeam] = useState([])
    const [pageLoaded, setPageLoaded] = useState(false)
    const [seeListen,setSeeListen] = useState({reponse1: "", reponse2: "", reponse3: "", reponse4: "", reponse5: ""})
    const [seeFeedback,setSeeFeedback] = useState({feedback1: "", feedback2: ""})
    const [seeMood,setSeeMood] = useState(0)
    const [isNewCampaign, setIsNewCampaign] = useState(false)
    const [stats, setStats] = useState([{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1},{date: "N/A", mood: 1}])
   
    const { SubMenu } = Menu;

    return (
    <div style={{backgroundColor:'#c6ebc9',height:'100vh', width:'100vw'}}>
              <Menu mode="horizontal" className="navbar">
       <img src={'./logo-transparent.png'} className='navLogo'></img>
       <span style={{marginLeft:'6px'}}>Hey Listen ! </span>
          <SubMenu style={{position:'absolute', top:'0', right:'0'}} key="SubMenu" 
            icon={<Avatar className="avatar" size={33}>{props.user.firstName[0]}{props.user.lastName[0]}</Avatar>}
          >
            <Menu.Item key="déconnexion" onClick={() => props.handleClickLogOut()}>Me déconnecter</Menu.Item>
            <Menu.Item key="informations personnelles"><Link to="/informations-personnelles">Informations personnelles</Link></Menu.Item>
          </SubMenu>
      </Menu>

      <Row gutter={[20, 24]} justify='center' align= 'middle' style={{height:'75%', width:'100%'}}>
        <Col span={6}>
        <Link to="/listen" >
        <Card hoverable style ={{filter:'drop-shadow(1px 1px 3px #555555)', borderRadius:10, height: '250px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <EditOutlined style={{ fontSize: '70px', color: '#59886b'}} />
        <div style={{textAlign:'center', fontSize: '25px', marginTop:'13px'}}>Faire mon listen</div>
       </Card>
       </Link>
       </Col>
        <Col span={6}>
        <Card hoverable style ={{filter:'drop-shadow(1px 1px 3px #555555)', borderRadius:10, height: '250px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <EyeOutlined style={{ fontSize: '70px', color: '#59886b'}} />
        <div style={{textAlign:'center', fontSize: '25px', marginTop:'13px'}}>Voir mon listen</div>
       </Card>
       </Col>
        <Col span={6}>
        <Link to="/historique-collab" >
        <Card hoverable style ={{filter:'drop-shadow(1px 1px 3px #555555)', borderRadius:10, height: '250px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <HistoryOutlined style={{ fontSize: '70px', color: '#59886b'}}/>
        <div style={{textAlign:'center', fontSize: '25px', marginTop:'13px'}}>Historique</div>
       </Card>
       </Link>
       </Col>
      </Row>
    </div>
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
)(ScreenDashboardCollab);

