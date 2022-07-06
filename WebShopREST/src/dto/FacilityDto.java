package dto;

import java.util.ArrayList;
import java.util.List;

import beans.Facility;
import beans.FacilityActivity;
import beans.FacilityType;
import beans.Location;
import beans.Manager;
import dao.*;


public class FacilityDto {
	private Facility facility;
	private Location location;
	private List<FacilityActivity> activitys;
	private String managerName;
	private String managerSurname;
	private int managerId;
	
	public FacilityDto() {
		
	}

	
	public FacilityDto(Facility facility, Location location, List<FacilityActivity> activitys) {
		super();
		this.facility = facility;
		this.location = location;
		this.activitys = activitys;
	}
	
	public Facility getFacility() {
		return facility;
	}


	public void setFacility(Facility facility) {
		this.facility = facility;
	}


	public Location getLocation() {
		return location;
	}


	public void setLocation(Location location) {
		this.location = location;
	}

	public List<FacilityActivity> getActivitys() {
		return activitys;
	}

	public void setActivitys(List<FacilityActivity> activitys) {
		this.activitys = activitys;
	}


	public String getManagerName() {
		return managerName;
	}


	public void setManagerName(String managerName) {
		this.managerName = managerName;
	}


	public String getManagerSurname() {
		return managerSurname;
	}


	public void setManagerSurname(String managerSurname) {
		this.managerSurname = managerSurname;
	}


	public int getManagerId() {
		return managerId;
	}


	public void setManagerId(int managerId) {
		this.managerId = managerId;
	}


	public FacilityDto(Facility facility, Manager manager) {
		super();
		this.facility = facility;
		this.managerName = manager.getName();
		this.managerSurname = manager.getSurname();
		this.managerId = manager.getId();
		
		LocationDao locationDao = new LocationDao();
		this.location = locationDao.getById(facility.getLocationId());
		
		FacilityActivityDao facilityActivityDao = new FacilityActivityDao();
		this.activitys = new ArrayList<FacilityActivity>();
		for(int id : facility.getFacilityActivityIds()) {
			activitys.add(facilityActivityDao.getById(id));
		}
		
	}
}
