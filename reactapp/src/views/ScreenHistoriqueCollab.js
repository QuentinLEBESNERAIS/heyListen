import React,{useState,useEffect} from 'react';
import '../App.css';
import {Row,Col,Input,Typography,Slider,Layout,Select,Divider,Button,Menu,Dropdown} from 'antd'
import {FrownOutlined,SmileOutlined,DownOutlined} from '@ant-design/icons';
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux';
import Nav from './Nav'
import _, { isArguments } from 'lodash';
import moment from 'moment';
import rafiki2 from '../Search-rafiki2.png'

function ScreenHistoriqueCollab(props) {

    const {Sider, Content} = Layout;
    const {Option} = Select;
    const [dataCollabFromBack, setDataCollabFromBack] = useState({matriochka:[{}]});
    const [year, setYear] = useState('')
    const [selectedListen, setSelectedListen] = useState({})
    const [firstSelectedListen, setFirstSelectedListen] = useState(true)

//--------Au chargement de la page fetch en BDD des listens inactifs par année et par mois
    useEffect(() => {
        const startPage = ( async () => {
            const data = await fetch('/matriochka/matriochka', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: `idFromFront=${props.userId._id}`
            })
            const body = await data.json()
            setDataCollabFromBack(body)
        })
        startPage();
    },[])

    function handleChange(value) {
        setYear(value);
    }

    function chooseListen(listen) {
        let listenTemp = listen
        setFirstSelectedListen(false)
        setSelectedListen(listenTemp)
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

    if(!props.userId.email){return (<Redirect to='/'/>)} else {
        return (
            <div>
                <Layout style={{backgroundColor:'#FFFFFF', width:'100%', minHeight: '100vh'}}>
                    <Nav/>
                    <Layout style={{marginTop:"48px", backgroundColor:'#FFFFFF',height:'100vh'}}>
                        <Sider style={{backgroundColor:'#00a38d',height:"100vh" ,position: 'fixed', zIndex: 1}}>
                            <Row>
                                <Col span={22} offset={2}>
                                    <Select defaultValue="Année" style={{width: 160, marginTop:20, filter:'drop-shadow(1px 1px 1px #003566)',marginRight:60,borderColor:'#003566', color:'#003566'}} onChange={handleChange}>
                                        {dataCollabFromBack.matriochka.map((years, i) => (<Option value={i}>{_.findKey(years)}</Option>))}
                                    </Select>
                                </Col>
                            </Row>
                            <Row type="flex" align-item="center"> 
                                {dataCollabFromBack.matriochka.map((years, i) => {
                                    if (year === i) {
                                        return dataCollabFromBack.matriochka[i][_.findKey(years)].map((months, o) => (
                                            <Col span={24} offset={0} style={{marginTop:20}} justify ="center" align="middle">
                                                <Dropdown overlay={menu(i, years, o, months)} trigger={['click']}>
                                                    <Button style={{backgroundColor:'#7FD1C5'}}>
                                                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                            <strong>{_.findKey(months)}/{_.findKey(years)} </strong><DownOutlined />
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
                                        <Typography.Text> Veuillez choisir un Listen dans le menu déroulant à gauche</Typography.Text>
                                    </Col>
                                    <Col span={20} offset={4} justify="center" align="middle" style={{marginTop:25}}>
                                        <img src={rafiki2} width={400}/>
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
                    </Layout>
                </Layout>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { userId: state.user }
}


export default connect(
    mapStateToProps,
    null
)(ScreenHistoriqueCollab);