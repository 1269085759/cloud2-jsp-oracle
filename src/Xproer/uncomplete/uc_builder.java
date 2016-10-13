package Xproer.uncomplete;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import Xproer.FolderInf;
import Xproer.XDebug;
import Xproer.xdb_files;

public class uc_builder {    
    public Map<String,uc_folder> folders;
    public List<xdb_files> files;// = new List<xdb_files>();//文件列表
    
    public uc_builder(){
    	this.folders = new HashMap<String,uc_folder>();
    	this.files = new ArrayList<xdb_files>();
    }

    public void add_file(ResultSet r,int uid) throws SQLException
    {
        xdb_files f = new xdb_files();
        f.uid       = uid;
        f.idSvr     = r.getInt(1);
        f.f_fdTask  = r.getBoolean(3);
        f.f_fdID    = r.getInt(4);
        f.nameLoc   = r.getString(7);
        f.pathLoc   = r.getString(8);
        f.md5       = r.getString(9);
        f.lenLoc    = r.getLong(10);
        f.sizeLoc   = r.getString(11);
        f.FilePos   = r.getLong(12);
        f.lenSvr    = r.getLong(13);
        f.perSvr    = r.getString(14);
        f.complete  = r.getBoolean(15);
        f.pathSvr   = r.getString(16);//fix(2015-03-19):修复无法续传文件的问题。
        
        this.files.add(f);
    }    

    public void update_folder(ResultSet r,int fd_id) throws SQLException
    {
    	uc_folder fd;
    	String key = Integer.toString(fd_id);
    	if(this.folders.containsKey(key))
    	{
    		fd = this.folders.get(key);
    		this.folders.remove(key);//删除旧数据
    	}
    	else
    	{
    		fd = new uc_folder();
    	}

        FolderInf fdSvr = new FolderInf();
        fdSvr.filesComplete = r.getInt(25);
        fdSvr.filesCount = r.getInt(24);
        fdSvr.foldersCount = r.getInt(23);
        fdSvr.idFile = r.getInt(1);
        fdSvr.idSvr = r.getInt(4);
        fdSvr.lenLoc = r.getLong(10);
        fdSvr.lenSvr = r.getLong(13);
        fdSvr.perSvr = r.getString(14);
        fdSvr.pathLoc = r.getString(21);
        fdSvr.pathSvr = r.getString(22);
        fdSvr.size = r.getString(19);
        fdSvr.nameLoc = r.getString(17);

        //double pdPer = 0;
        //long len = fdSvr.lenLoc;
        //if (fdSvr.lenSvr > 0 && len > 0)
        //{
        //    pdPer = (double)Math.round( ( (fdSvr.lenSvr * 1.0) / len * 1.0) * 100.0);
        //}
        //fdSvr.perSvr = Double.toString(pdPer) + "%";

        fd.m_fdSvr = fdSvr;
        this.folders.put( key, fd);
    }
    

    public void add_child(ResultSet r,int pidRoot) throws SQLException
    {
    	String key = Integer.toString(pidRoot);
        uc_file_child uf = new uc_file_child();
        uf.read(pidRoot, r);
        
        uc_folder fd;
        if (this.folders.containsKey(key))
        {
            fd = this.folders.get(key);
            this.folders.remove(key);
        }
        else{fd = new uc_folder();}
        fd.m_files.add(uf);
        this.folders.put(key, fd);
    }
    

    public String to_json()
    {
    	int sz = this.files.size();
    	if(sz < 1) return null;
    	XDebug.Output("count",sz);
    	        
    	for(int i = 0 ; i < sz ; ++i)
    	{
    		xdb_files f = this.files.get(i);
            //是文件夹任务=>取文件夹JSON
            if (f.f_fdTask)
            {
                uc_folder fd = null;
                String fdKey = Integer.toString(f.f_fdID);
                if(this.folders.containsKey(fdKey))
                {
                	fd = this.folders.get(fdKey);
                }
                if(fd != null)
                {
                	f.perSvr = fd.m_fdSvr.perSvr;
                	f.fd_json = fd.getJson();
                }
            }
            
        }
    	
    	return JSONArray.fromObject(this.files).toString();
    }

}
