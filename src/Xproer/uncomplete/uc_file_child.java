package Xproer.uncomplete;

import java.sql.ResultSet;
import java.sql.SQLException;

import Xproer.FileInf;

public class uc_file_child extends FileInf{
    
    public uc_file_child()
    {
    }

    public void read(int pidRoot,ResultSet r) throws SQLException
    {
    	this.idSvr = r.getInt(1);
        this.nameLoc = r.getString(7);// (string)r["f_nameLoc"];
        this.pathLoc = r.getString(8);// (string)r["f_pathLoc"];
        this.pathSvr = r.getString(16);//(string)r["f_pathSvr"];
        this.lenLoc = r.getLong(10);//(long)r["f_lenLoc"];
        this.lenSvr = r.getLong(13);//(long)r["f_lenSvr"];
        this.perSvr = r.getString(14);//f_perSvr
        this.sizeLoc = r.getString(11);//(string)r["f_sizeLoc"];
        this.md5 = r.getString(9);//(string)r["f_md5"];
        this.pidRoot = pidRoot;
        this.pidSvr = r.getInt(2);//(int)r["f_pid"];
    }

}
