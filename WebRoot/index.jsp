<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />    
    <title>My JSP 'index.jsp' starting page</title>
    <link href="js/cloud2.css" type="text/css" rel="Stylesheet"/>
    <script type="text/javascript" src="js/jquery-1.4.min.js"></script>
    <script type="text/javascript" src="js/json2.min.js" charset="utf-8"></script>
    <script type="text/javascript" src="js/cloud2.cloud.js" charset="utf-8" ></script>
    <script type="text/javascript" src="js/cloud2.file.js" charset="utf-8" ></script>
    <script type="text/javascript" src="js/cloud2.folder.js" charset="utf-8" ></script>    
    <script type="text/javascript" src="js/cloud2.js" charset="utf-8" ></script>
	<script language="javascript" type="text/javascript">
    	var cbMgr = new HttpUploaderMgr();
    	cbMgr.event.md5Complete = function (obj, md5) { /*alert(md5);*/ };
        cbMgr.event.fileComplete = function (obj) { /*alert(obj.pathSvr);*/ };
        cbMgr.Config.Cloud = cloud_config.aliyun;
        //设置附加字段信息
    	cbMgr.Config.Fields["test"] = "test";
        //使用不同项目配置
        //cbMgr.set_config(up6_config.qq);
        //cbMgr.set_config(up6_config.qq_mail);
        //cbMgr.set_config(up6_config.qq_zone);
        //cbMgr.set_config(up6_config.erp);
        //cbMgr.set_config(up6_config.oa);
        //cbMgr.set_config(up6_config.share_point);
        //cbMgr.set_config(up6_config.vm);
    	

    	$(document).ready(function()
    	{
    		cbMgr.load_to("FilePanel");
        });

    	//上传本地文件
        function postFileLoc()
        {
            cbMgr.addFileLoc("D:\\soft\\QQ2013.exe");
            cbMgr.PostFirst();
        }
    </script>
  </head>
<body>
	<a href="db/clear.jsp" target="_blank">清空数据库</a>
	<p><a href="index-single.htm" target="_blank">打开单面板上传页面</a></p>
	<p><a href="downloader/index.htm" target="_blank">打开下载页面</a></p>
	<div id="FilePanel"></div>
	<div id="msg"></div>
</body>
</html>
