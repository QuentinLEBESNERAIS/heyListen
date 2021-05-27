import React,{useState,useEffect} from 'react';
import '../App.css';
import {Row,Col,Input,Typography,Slider,Layout,Select,Divider,Modal,Button, Menu, Dropdown} from 'antd'
import {FrownOutlined,SmileOutlined,DownOutlined} from '@ant-design/icons';
import {Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux';
import Nav from './Nav'
import _, { isArguments } from 'lodash';
import moment from 'moment';
import rafiki from '../search-rafiki.png'

function ScreenHistoriqueManager(props) {
    const {Sider, Content} = Layout;
    const {Option} = Select;
    const [visibleModal, setVisibleModal] = useState(false);
    const [myTeamFromBack, setMyTeamFromBack] = useState ([])
    const [dataCollabFromBack, setDataCollabFromBack] = useState({matriochka:[{}]});
    const [selectedCollab, setSelectedCollab] = useState('')
    const [year, setYear] = useState('')
    const [selectedListen, setSelectedListen] = useState({})
    const [firstSelectedListen, setFirstSelectedListen] = useState(true)
    const [firstSelectedCollab, setFirstSelectedCollab] = useState(true)
    const [yearDropdown, setYearDropdown] = useState("default")

    useEffect(() => {
        const startPage = ( async () => {
            if (props.shownModal == false){
                var rawResponse = await fetch(`/find-listen?id=${props.user._id}`);
                var foundListen = await rawResponse.json();
                if (foundListen.response == true){
                    console.log('foundListen.response', foundListen.response)
                    setVisibleModal(true)
                }
            }
            const data = await fetch('/matriochka/find-Collab', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: `idFromFront=${props.userId._id}`
            })
            const body = await data.json()
            console.log("MyTeamFromBack = ", body.myTeam.collab)
            setMyTeamFromBack(body.myTeam.collab)
        })
        startPage();
    },[])

    async function handleChangeCollaborateur(value) {
        setYearDropdown("default")
        setFirstSelectedListen(true)
        setYear('')
        setDataCollabFromBack({matriochka:[{}]})
        setSelectedCollab(value);
        (console.log("Selected Collab ID = ", selectedCollab))
        const callMatriochka = ( async () => {
            const data = await fetch('/matriochka/matriochka', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: `idFromFront=${value}`
            })
            const body2 = await data.json()
            console.log(body2)
            setDataCollabFromBack(body2)
        })
        callMatriochka();
        setFirstSelectedCollab(false)
    }

    function handleChange(value) {
        setYearDropdown(value)
        setYear(value);
    }

    function chooseListen(listen) {
        let listenTemp = listen
        setFirstSelectedListen(false)
        setSelectedListen(listenTemp)
        console.log("SELECTED LISTEN = ", selectedListen)
    }

    const menu = (i, years, o, months) => (
        <Menu>
            {dataCollabFromBack.matriochka[i][_.findKey(years)][o][_.findKey(months)][0].map((days, p) => (
                <Menu.Item key={p}>
                    <Typography.Text onClick={() => chooseListen(days)}><strong>{moment(days.createdAt).format('DD')} / {_.findKey(months)} / {_.findKey(years)}</strong></Typography.Text>
                </Menu.Item>
            ))}
        </Menu>
    );

    const handleCancel = () => {
        props.modalState()
        setVisibleModal(false);
    };


    if(props.userId.type==="manager"){
        return (
            <div>
                <Layout  style={{backgroundColor:'#007DB3', width:'100%', minHeight: '100vh'}}>
                    <Nav/>
                    <Layout style={{marginTop:"48px", backgroundColor:'#FFFFFF',height:'100vh'}}>
                        <Sider minHeight={100} style={{backgroundColor:'#003376',height:'100vh',position: 'fixed', zIndex: 1}}>
                            <Row>
                                <Col span={22} offset={2}>
                                    <Select defaultValue="Collaborateur" style={{width: 160, marginTop:20, filter:'drop-shadow(1px 1px 1px #003566)',marginRight:60,borderColor:'#003566', color:'#003566'}} onChange={handleChangeCollaborateur}>
                                        {myTeamFromBack.map((collab, i) => (
                                            <Option value={collab._id}>{collab.firstName} {collab.lastName}</Option>
                                        ))}
                                    </Select>
                                        {firstSelectedCollab === false &&
                                            <Select value={yearDropdown} defaultValue="Année" style={{width: 160, marginTop:20, filter:'drop-shadow(1px 1px 1px #003566)',marginRight:60,borderColor:'#003566', color:'#003566'}} onChange={handleChange}>
                                                <Option value="default" disabled>Année</Option>
                                                {dataCollabFromBack.matriochka.map((years, i) => (
                                                    <Option value={i}>{_.findKey(years)}</Option>
                                                ))}
                                            </Select>
                                        }
                                </Col>
                            </Row>
                            <Row type="flex" align-item="center">
                                {dataCollabFromBack.matriochka.map((years, i) => {
                                    if (year === i) {
                                        return dataCollabFromBack.matriochka[i][_.findKey(years)]?.map((months, o) => (
                                            <Col span={24} offset={0} style={{marginTop:10, marginBottom:10}} justify ="center" align="middle">
                                                <Dropdown overlay={menu(i, years, o, months)} trigger={['click']}>
                                                    <Button type="primary">
                                                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                            <strong>{_.findKey(months)} / {_.findKey(years)} </strong><DownOutlined />
                                                        </a>
                                                    </Button>
                                                </Dropdown>
                                            </Col>
                                        )) 
                                    }
                                })}
                            </Row>
                        </Sider>
                        <Content>
                            {firstSelectedListen === true && 
                                <Row>
                                    <Col span={20} offset={4} justify="center" align="middle" style={{marginTop:25}}>
                                        <Typography.Text style={{color:'black'}}> Veuillez choisir un Collaborateur dans le menu déroulant à gauche</Typography.Text>
                                    </Col>
                                    <Col span={20} offset={4} justify="center" align="middle" style={{marginTop:25}}>
                                        <img src={rafiki} width={400}/>
                                    </Col>
                                </Row>
                            }
                            {firstSelectedListen === false &&
                                <Row>
                                    <Col span={20} offset={4} justify="center" align="middle" style={{marginTop:20}}>
                                        <Typography.Text><strong>{moment(selectedListen.createdAt).format('DD-MM-YYYY')}</strong></Typography.Text>
                                    </Col>
                                    <Col span={20} offset={4}>
                                        <div className="icon-wrapper">
                                            <FrownOutlined style={{color:'#A62626'}}/>
                                            <Slider marks={{1:'1',2:'2',3:'3',4:'4',5:'5'}} step={1} value={selectedListen.mood} min={1} max={5}/>
                                            <SmileOutlined style={{color:'#448f30'}}/>
                                        </div>
                                    </Col>
                                    <Col span={18} offset={6}>
                                        <Col style={{marginBottom:4}}>
                                            <Typography.Text><strong>Quels sont les points positifs de la période passée ?</strong></Typography.Text>
                                        </Col>
                                        <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} value={selectedListen.answersCollab ? selectedListen.answersCollab[0].reponse1: "Vide"} readOnly/>
                                    </Col>
                                    <Col span={18} offset={6}>
                                        <Col style={{marginBottom:4}}>
                                            <Typography.Text><strong>Quelles ont été les difficultés de la période passée ?</strong></Typography.Text>
                                        </Col>
                                        <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} value={selectedListen.answersCollab ? selectedListen.answersCollab[0].reponse2: "Vide"} readOnly/>
                                    </Col>
                                    <Col span={18} offset={6}>
                                        <Col style={{marginBottom:4}}>
                                            <Typography.Text><strong>Quel est mon objectif prioritaire pour la prériode à venir ?</strong></Typography.Text>
                                        </Col>
                                        <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} value={selectedListen.answersCollab ? selectedListen.answersCollab[0].reponse3: "Vide"} readOnly/>
                                    </Col>
                                    <Col span={18} offset={6}>
                                        <Col style={{marginBottom:4}}>
                                            <Typography.Text><strong>Qu'attends-je de mon manager pour la période à venir ?</strong></Typography.Text>
                                        </Col>
                                        <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} value={selectedListen.answersCollab ? selectedListen.answersCollab[0].reponse4: "Vide"} readOnly/>
                                    </Col>
                                    <Col span={18} offset={6}>
                                        <Col style={{marginBottom:4}}>
                                            <Typography.Text><strong>Un point sur lequel j'aimerais revenir :</strong></Typography.Text>
                                        </Col>
                                        <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} value={selectedListen.answersCollab ? selectedListen.answersCollab[0].reponse5: "Vide"} readOnly/>
                                    </Col>
                                    <Divider style={{marginLeft:110}}><strong>FeedBack Manager</strong></Divider>
                                    <Col span={18} offset={6}>
                                        <Col style={{marginBottom:4}}>
                                            <Typography.Text><strong>Qu'avez-vous pensé de la performance de ce collaborateur ?</strong></Typography.Text>
                                        </Col>
                                        <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} value={selectedListen.answersFeedback ? selectedListen.answersFeedback[0].feedback1: "Vide"} readOnly/>
                                    </Col>
                                    <Col span={18} offset={6}>
                                        <Col style={{marginBottom:4}}>
                                            <Typography.Text><strong>Qu'attendez-vous de ce collaborateur pour la période à venir ?</strong></Typography.Text>
                                        </Col>
                                        <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} value={selectedListen.answersFeedback ? selectedListen.answersFeedback[0].feedback2: "Vide"} readOnly/>
                                    </Col>
                                </Row>        
                            }
                        </Content>

                        <Modal className='center' visible={visibleModal} onCancel={handleCancel} footer={<Link to="/listen" >
                            <Button key="back" onClick={props.modalState()}>Remplir mon listen</Button></Link>} width={700} height={500}>
                            <div style={{color:'red', display:'flex', justifyContent:'center'}}>Bonjour, veuillez remplir votre Listen !</div>
                        </Modal>
                    </Layout>
                </Layout>
            </div>
        )
    } else if (props.userId.type==="collab") {
        return <Redirect to='/historique-collab'/> 
    } else {
        return <Redirect to='/'/> 
    };
}

function mapStateToProps(state) {
    console.log('test userStore',state.user._id)
    return { userId: state.user }
}

function mapDispatchToProps(dispatch){
    return {
        modalState: function(){
            dispatch({type:"modalState"})
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScreenHistoriqueManager);