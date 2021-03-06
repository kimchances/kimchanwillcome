var express = require('express')
var mysqlSucker = require('./models/mysql-connector')
var router = express.Router()
var requestIp = require('request-ip');

router.get('/', function (req, res) {
    res.render('index.html');
    //查询有没有本身的记录
    var IP = requestIp.getClientIp(req)
    let sqlStatement = `SELECT GuestIpAddress FROM Idx_Guest_Logs WHERE GuestIpAddress='${IP}'`;
    mysqlSucker.query(sqlStatement, [], (results, fields) => {
        if (results.length) {
            //更新记录时间
            let sqlStatement = `UPDATE Idx_Guest_Logs SET GuestTime = NOW() WHERE GuestIpAddress='${IP}'`;
            mysqlSucker.query(sqlStatement, [], (results, fields) => {
                console.info(`更新了访问时间`)
            });
        } else {
            //写入记录信息
            let sqlStatement = `INSERT INTO Idx_Guest_Logs (GuestIpAddress,GuestName,GuestTime) VALUES ('${IP}','${req.headers['user-agent']}',NOW())`;
            mysqlSucker.query(sqlStatement, [], (results, fields) => {
                console.info(`写入了访问记录`)
            });
        }
    });
})

router.get('/loading.txt', function (req, res) {
    res.end('<div class="wrap"><div class="bg"><div class="loading"><span class="title">Loading..</span></div></div></div>');
});

//获取用户信息
router.post('/getUser', function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    let sqlStatement = 'SELECT Idx_Info.Idx_If_name AS uName,  Idx_Info.Idx_If_content AS uContent,  Idx_Info.Idx_Pj_Title AS pTitle,  Idx_Info.Idx_Pj_Content AS pContent,  Idx_Info.Idx_If_headImg AS uHeadImg,  Idx_Info.Idx_Wb_title AS wTitle,  Idx_Info.Idx_Wb_nav AS wNav FROM Idx_Info';
    mysqlSucker.query(sqlStatement, [], function (results, fields) {
        res.end(JSON.stringify(results));
    });
});
//获取分类
router.post('/getCategory', function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    let sqlStatement = 'SELECT Idx_Category.Idx_Ctgr_Name AS cName,  Idx_Category.Idx_Ctgr_NameEn AS cNameEn,  Idx_Category.Idx_Ctgr_Content AS cContent,  Idx_Category.Idx_Ctgr_Url AS cUrl,  Idx_Category.Idx_Ctgr_Font AS cFont,  Idx_Category.Idx_Ctgr_JumpEnable AS jump FROM Idx_Category';
    mysqlSucker.query(sqlStatement, [], function (results, fields) {
        res.end(JSON.stringify(results));
    });
});
//获取项目列表
router.post('/getProjects', function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    let sqlStatement = '  SELECT Idx_Projects.id AS pId,  Idx_Projects.Idx_Pro_Name AS pName,  Idx_Projects.Idx_Pro_Pics AS pPics,  Idx_Projects.Idx_Pro_URL AS pUrl,  Idx_Projects.Idx_Pro_Content AS pContent,  Idx_Projects.Idx_Pro_JumpEnable AS jump FROM Idx_Projects';
    mysqlSucker.query(sqlStatement, [], function (results, fields) {
        res.end(JSON.stringify(results));
    });
});

router.get('/project_detail.html', function (req, res, next) {
    res.render('project_detail.html');
});
//获取项目详情
router.post('/getProjectDetail', function (req, res, next) {
    let reqData = req.body;
    if (reqData.projectId) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        let sqlStatement = `SELECT Idx_Pro_C_Html AS myAreaContent FROM Idx_Projects AS pj,  Idx_Projects_Detail AS pd WHERE pj.id = pd.Idx_Pro_C_id AND pj.id =${reqData.projectId}`;
        mysqlSucker.query(sqlStatement, [], function (results, fields) {
            res.end(JSON.stringify(results));
        });
    } else {
        res.end('<h1>NULL</h1>>');
    }
});

module.exports = router
