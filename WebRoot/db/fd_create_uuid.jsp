<%@ page language="java" import="Xproer.*" pageEncoding="UTF-8"%><%@
	page contentType="text/html;charset=UTF-8"%><%@ 
	page import="com.google.gson.*" %><%@
	page import="Xproer.*" %><%@
	page import="Xproer.biz.*" %><%@
	page import="net.sf.json.*" %><%@
	page import="org.apache.commons.lang.StringUtils" %><%@
	page import="java.net.URLDecoder" %><%@
	page import="java.net.URLEncoder" %><%@
	page import="java.util.ArrayList" %><%@
	page import="java.util.HashMap" %><%@
	page import="java.util.Map" %><%
/*
	使用uuid模式创建文件夹，可与客户端文件夹完全保持一致。但是不检查重复文件。
	文件夹上传方法中调用。
	客户端上传的文件夹JSON格式：
    [
	     [name:"soft"		    //文件夹名称
	     ,pid:0                //父级ID
	     ,idLoc:0              //文件夹ID，客户端定义
	     ,idSvr:0              //文件夹ID，与数据库中的xdb_folder.fd_id对应。
	     ,length:"102032"      //数字化的文件夹大小，以字节为单位
	     ,size:"10G"           //格式化的文件夹大小
	     ,pathLoc:"d:\\soft"   //文件夹在客户端的路径
	     ,pathSvr:"e:\\web"    //文件夹在服务端的路径
	     ,foldersCount:0       //子文件夹总数
	     ,filesCount:0         //子文件总数
	     ,filesComplete:0      //已上传完成的子文件总数
	     ,folders:[
	           {name:"img1",pidLoc:0,pidSvr:10,idLoc:1,idSvr:0,pathLoc:"D:\\Soft\\img1",pathSvr:"E:\\Web"}
	          ,{name:"img2",pidLoc:1,pidSvr:10,idLoc:2,idSvr:0,pathLoc:"D:\\Soft\\image2",pathSvr:"E:\\Web"}
	          ,{name:"img3",pidLoc:2,pidSvr:10,idLoc:3,idSvr:0,pathLoc:"D:\\Soft\\image2\\img3",pathSvr:"E:\\Web"}
	          ]
	     ,files:[
	           {name:"f1.exe",idLoc:0,idSvr:0,pidRoot:0,pidLoc:1,pidSvr:0,length:"100",size:"100KB",pathLoc:"",pathSvr:""}
	          ,{name:"f2.exe",idLoc:0,idSvr:0,pidRoot:0,pidLoc:1,pidSvr:0,length:"100",size:"100KB",pathLoc:"",pathSvr:""}
	          ,{name:"f3.exe",idLoc:0,idSvr:0,pidRoot:0,pidLoc:1,pidSvr:0,length:"100",size:"100KB",pathLoc:"",pathSvr:""}
	          ,{name:"f4.rar",idLoc:0,idSvr:0,pidRoot:0,pidLoc:1,pidSvr:0,length:"100",size:"100KB",pathLoc:"",pathSvr:""}
	          ]
	]

	更新记录：
		2014-07-23 创建
		2014-08-05 修复BUG，上传文件夹如果没有子文件夹时报错的问题。
		2016-04-09 完善逻辑

	JSON格式化工具：http://tool.oschina.net/codeformat/json
	POST数据过大导致接收到的参数为空解决方法：http://sishuok.com/forum/posts/list/2048.html
*/
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String jsonTxt = request.getParameter("folder");
String uidStr = request.getParameter("uid");
int uid = 0;

//参数为空
if (	StringUtils.isBlank(jsonTxt)
	||	StringUtils.isBlank(uidStr) )
{
	out.write("param is null\n");
	return;
}
uid = Integer.parseInt(uidStr);

jsonTxt = jsonTxt.replace("+","%20");
//客户端使用的是encodeURIComponent编码，
jsonTxt = URLDecoder.decode(jsonTxt,"UTF-8");//utf-8解码

JSONObject jsonSrc = JSONObject.fromObject(jsonTxt);

//文件夹ID，文件夹对象
Map<String,FolderInf> tbFolders = new HashMap<String,FolderInf>();

Gson g = new Gson();
JsonParser parser = new JsonParser();//初始化解析json格式的对象
JsonObject folderSrc = parser.parse(jsonTxt).getAsJsonObject();
XDebug.Output("jsonTxt",jsonTxt);
JsonArray jarFolders = new JsonArray();
if(null != folderSrc.get("folders"))
{
	jarFolders = folderSrc.get("folders").getAsJsonArray();
}

JsonArray jarFiles = new JsonArray();
if( null != folderSrc.get("files"))
{
	jarFiles = folderSrc.get("files").getAsJsonArray();
}
folderSrc.remove("folders");
folderSrc.remove("files");
FolderInf fdroot = g.fromJson(folderSrc,FolderInf.class);
fdroot.pathRel = fdroot.nameLoc;//相对路径，提供给下载控件使用

//使用uuid模式
PathUuidBuilder pb = new PathUuidBuilder();
fdroot.pathSvr = pb.genFolder( uid, fdroot);
PathTool.createDirectory(fdroot.pathSvr);//创建文件夹

fdroot.idSvr = DBFolder.Add(fdroot);//添加到数据库
fdroot.idFile = DBFile.Add(fdroot);//向文件表添加一条数据
tbFolders.put("0", fdroot);//提供给子文件夹使用

//解析文件夹
ArrayList<FolderInf> arrFolders = new ArrayList<FolderInf>();
for(int i = 0 ; i < jarFolders.size() ; ++i)
{
	JsonElement obj = jarFolders.get(i);
	XDebug.Output("Folder",obj.toString());
	FolderInf folder = g.fromJson(obj,FolderInf.class);
	folder.uid = uid;
	folder.pidRoot = fdroot.idSvr;//下载控件信息
	//查找父级文件夹
	FolderInf fdParent = (FolderInf)tbFolders.get( Integer.toString(folder.pidLoc) );	
	folder.pathSvr = PathTool.combine(fdParent.pathSvr,folder.nameLoc);
	//fix:创建子文件夹
	PathTool.createDirectory(folder.pathSvr);
	folder.pathRel = fdParent.pathRel + "/" + folder.nameLoc;//相对路径，提供给下载控件使用。
	folder.pidSvr = fdParent.idSvr;
	folder.idSvr = DBFolder.Add(folder);//添加到数据库
	tbFolders.put( Integer.toString(folder.idLoc), folder);
	arrFolders.add(folder);
}

//解析文件
ArrayList<FileInf> arrFiles = new ArrayList<FileInf>();
for(int i = 0 ; i < jarFiles.size() ; ++i)
{
	JsonElement obj = jarFiles.get(i);
	FileInf file = g.fromJson(obj,FileInf.class);
	FolderInf pidFolder = (FolderInf)tbFolders.get(Integer.toString(file.pidLoc));
	file.uid = uid;
	file.pidRoot = fdroot.idSvr;
	file.pidSvr = pidFolder.idSvr;
	file.nameSvr = file.nameLoc;
    file.pathSvr = PathTool.combine(pidFolder.pathSvr,file.nameLoc);
	file.idSvr = DBFile.Add(file);//将信息添加到数据库
	arrFiles.add( file );
	XDebug.Output("文件名称：",file.nameLoc);
	XDebug.Output("文件大小：",file.lenLoc);
}

//转换为JSON
JSONObject obj = JSONObject.fromObject(fdroot);
obj.put("folders", JSONArray.fromObject(arrFolders));
obj.put("files", JSONArray.fromObject(arrFiles));
obj.put("complete",false);

String json = obj.toString();
XDebug.Output("fd_create_uuid-输出JSON",json);
json = URLEncoder.encode( json ,"UTF-8");
//UrlEncode会将空格解析成+号，
json = json.replace("+", "%20");

XDebug.Output("编码后的JSON",json);

out.write(json);
%>