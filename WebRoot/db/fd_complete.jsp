<%@ page language="java" import="Xproer.DBFile" pageEncoding="UTF-8"%><%@
	page contentType="text/html;charset=UTF-8"%><%@ 
	page import="Xproer.DBFolder" %><%@
	page import="org.apache.commons.lang.StringUtils" %><%
/*
	此页面主要更新文件夹数据表。已上传字段
	更新记录：
		2014-07-23 创建
*/
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String id_file	= request.getParameter("id_file");
String id_fd	= request.getParameter("id_folder");
String uid	= request.getParameter("uid");
String cbk 	= request.getParameter("callback");//jsonp
int ret = 0;

//参数为空
if (	!StringUtils.isBlank(uid)
	||	!StringUtils.isBlank(id_fd))
{
	DBFolder.Complete(Integer.parseInt(id_fd),Integer.parseInt(uid));
	DBFile.fd_complete(Integer.parseInt(id_file));
	ret = 1;
}
out.write(cbk + "(" + ret + ")");
%>