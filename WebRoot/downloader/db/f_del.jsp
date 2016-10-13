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
	从down_files中删除文件下载任务
	更新记录：
		2015-05-13 创建
*/
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String fid = request.getParameter("fid");
String uid = request.getParameter("uid");
String mac = request.getParameter("mac"); 
String cbk = request.getParameter("callback");//jsonp

if (	StringUtils.isBlank(uid)
	||	StringUtils.isBlank(mac)
	||	StringUtils.isBlank(fid)
	)
{
	out.write("参数为空 ");
	return;
}
DnFile.Delete(fid,uid,mac);
out.write(cbk+"(1)");
%>