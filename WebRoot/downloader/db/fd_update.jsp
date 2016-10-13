<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%><%@ 
	page contentType="text/html;charset=UTF-8"%><%@ 
	page import="Xproer.*" %><%@ 
	page import="org.apache.commons.lang.*" %><%@
	page import="java.io.*" %><%
/*
	此页面主要用来更新文件夹上传进度。
	更新记录：
		2015-05-13 创建。
*/
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String fid = request.getParameter("fid");
String uid = request.getParameter("uid");
String mac = request.getParameter("mac");
String per = request.getParameter("percent");

if (	StringUtils.isBlank(uid)
	||	StringUtils.isBlank(mac)
	||	StringUtils.isBlank(fid)
	||	StringUtils.isBlank(per)
	)
{
	out.write("参数为空 ");
	return;
}
DnFolder.Update(fid,uid,mac,per);
%>