<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%><%@ 
	page contentType="text/html;charset=UTF-8"%><%@ 
	page import="Xproer.*" %><%@ 
	page import="java.net.URLDecoder" %><%@ 
	page import="java.net.URLEncoder" %><%@ 
	page import="org.apache.commons.lang.*" %><%@ 
	page import="com.google.gson.FieldNamingPolicy" %><%@ 
	page import="com.google.gson.Gson" %><%@ 
	page import="com.google.gson.GsonBuilder" %><%@ 
	page import="com.google.gson.annotations.SerializedName" %><%@ 
	page import="java.io.*" %><%
/*
	此页面列表所有已经上传完的文件
	测试路径：http://localhost:8080/HttpUploader6Oracle/downloader/db/f_list.cmp.jsp?uid=0
	更新记录：
		2012-05-24 完善
		2012-06-29 增加创建文件逻辑，
*/
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String uid 		 = request.getParameter("uid");
String callback  = request.getParameter("callback");//jsonp

if (StringUtils.isBlank(uid))
{
	out.write("参数为空 ");
	return;
}

String json = DBFile.GetAllComplete( Integer.parseInt(uid) );
json = URLEncoder.encode(json,"utf-8");
json = json.replace("+","%20");
out.write(json);
%>