package Xproer.biz;

import java.io.IOException;

import Xproer.PathTool;
import Xproer.xdb_files;

public class PathCloudBuilder extends PathBuilder {
	// 云资源访问链接前缀
	public String m_url = "http://ncmem.oss-cn-shenzhen.aliyuncs.com/";
	
	/* 所有文件均以md5模式存储
	 * 格式：
	 * 		/md5.ext 
	 */
	public String genFile(int uid,xdb_files f) throws IOException{

		return this.genFile(uid, f.md5, f.nameLoc);
	}
	
	public String genFile(int uid, String md5,String nameLoc) throws IOException
    {
		String name = md5;
		String ext = "." + PathTool.getExtention( nameLoc );
		if(!this.m_url.endsWith("/")) this.m_url += "/";
		return this.m_url + name + ext;
    }
}