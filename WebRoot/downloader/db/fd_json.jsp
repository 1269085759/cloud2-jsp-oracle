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
	此页面主要用来从hup_folders中获取文件夹JSON数据
	更新记录：
		2015-05-13 创建
*/
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String idSvr 	 = request.getParameter("idSvr");
String fdID		 = request.getParameter("fdID"); 
String callback  = request.getParameter("callback");//jsonp

FolderInf fi = new FolderInf();
String json = "";
if(!StringUtils.isBlank(idSvr))
{
	json = DnFolder.GetFolderData(Integer.parseInt(idSvr),fi);
}
else if(!StringUtils.isBlank(fdID))
{
	json = DBFolder.GetFolderData(Integer.parseInt(fdID),fi);
}
XDebug.Output("json",json);
json = URLEncoder.encode(json,"utf-8");
json = json.replaceAll("\\+","%20");
//json = callback + "(" + json + ")";//返回jsonp格式数据。
out.write(json);
%>