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
	删除文件夹下载任务
	更新记录：
		2015-05-13
*/
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String uid 		 = request.getParameter("uid");
String mac		 = request.getParameter("mac");
String idF		 = request.getParameter("idF");//与down_files.f_id对应
String idFD		 = request.getParameter("idFD");//与down_folders.fd_id对应

if (StringUtils.isBlank(uid)
	||StringUtils.isBlank(mac)
	||StringUtils.isBlank(idF)
	||StringUtils.isBlank(idFD)
	)
{
	out.write("参数为空 ");
	return;
}
DnFolder.Del(idF,idFD,uid,mac);
%>