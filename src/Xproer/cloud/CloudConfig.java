package Xproer.cloud;

public class CloudConfig {
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getBucket() {
		return bucket;
	}
	
	public void setBucket(String bucket) {
		this.bucket = bucket;
	}
	
	public String getFileUrl() {
		return fileUrl;
	}
	
	public void setFileUrl(String fileUrl) {
		this.fileUrl = fileUrl;
	}
	
	public String getAk() {
		return ak;
	}
	
	public void setAk(String ak) {
		this.ak = ak;
	}
	
	public String getUrl() {
		return url;
	}
	
	public void setUrl(String url) {
		this.url = url;
	}
	
	public String getFolder() {
		return folder;
	}
	
	public void setFolder(String folder) {
		this.folder = folder;
	}
	
	public String name = "";
	public String bucket = "";
	public String fileUrl = "http://www.ncmem.com/";
	public String ak = "";
	public String url = "";
	public String folder = "";

}
