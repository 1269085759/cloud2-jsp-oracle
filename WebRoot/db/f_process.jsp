<%@ page language="java" import="Xproer.DBFile" pageEncoding="UTF-8"%><%@
	page contentType="text/html;charset=UTF-8"%><%@ 
	page import="Xproer.XDebug" %><%@
	page import="org.apache.commons.lang.StringUtils" %><%@
	page import="java.net.URLDecoder"%><%
/*
	此页面负责将文件块数据写入文件中。
	此页面一般由控件负责调用
	参数：
		uid
		idSvr
		md5
		lenSvr
		pathSvr
		RangePos
		fd_idSvr
		fd_lenSvr
	更新记录：
		2012-04-12 更新文件大小变量类型，增加对2G以上文件的支持。
		2012-04-18 取消更新文件上传进度信息逻辑。
		2012-10-25 整合更新文件进度信息功能。减少客户端的AJAX调用。
		2014-07-23 优化代码。
		2015-03-19 客户端提供pathSvr，此页面减少一次访问数据库的操作。
		2016-04-09 优化文件存储逻辑，增加更新文件夹进度逻辑
*/
//String path = request.getContextPath();
//String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String uid 			= request.getParameter("uid");
String idSvr 		= request.getParameter("idSvr");
String md5 			= request.getParameter("md5");
String perSvr 		= request.getParameter("perSvr");
String lenSvr		= request.getParameter("lenSvr");
String lenLoc		= request.getParameter("lenLoc");
String complete		= request.getParameter("complete");
String cbk 			= request.getParameter("callback");//jsonp
 
//参数为空
if ( 	StringUtils.isBlank( lenSvr )
	|| 	StringUtils.isBlank( uid )
	|| 	StringUtils.isBlank( idSvr )
	|| 	StringUtils.isBlank( md5 ))
{
	XDebug.Output("uid", uid);
	XDebug.Output("idSvr", idSvr);
	XDebug.Output("md5", md5);
	XDebug.Output(cbk + "({\"value\":null,\"des\":\"param is null\"})");
	return;
}

	XDebug.Output("perSvr", perSvr);
	XDebug.Output("lenSvr", lenSvr);
	XDebug.Output("lenLoc", lenLoc);
	XDebug.Output("uid", uid);
	XDebug.Output("idSvr", idSvr);
	XDebug.Output("complete", complete);
	
	boolean cmp = StringUtils.equals(complete,"true");
	
	//更新文件进度信息
	DBFile db = new DBFile();
	
	db.f_process(Integer.parseInt(uid),Integer.parseInt(idSvr), 0, Long.parseLong(lenSvr),perSvr,cmp);		
			
	out.write(cbk + "({\"value\":true})");

%>