package beans;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Customer extends User{
	protected int membershipId;
	protected double points;
	protected int customerTypeId;
	protected List<Integer> visitedFacilityIds;
	protected List<WorkoutHistory> workoutHistory;
	
	public Customer(int membershipId, double points) {
		super();
		this.membershipId = membershipId;
		this.points = points;
	}

	public Customer(int membershipId, double points, int customerTypeId, List<Integer> visitedFacilityIds, List<WorkoutHistory> workoutHistory) {
		super();
		this.membershipId = membershipId;
		this.points = points;
		this.customerTypeId = customerTypeId;
		
		this.visitedFacilityIds = visitedFacilityIds;
		if(visitedFacilityIds == null) {
			this.visitedFacilityIds = new ArrayList<Integer>();
		}
		
		this.workoutHistory = workoutHistory;
		if(workoutHistory == null) {
			this.workoutHistory = new ArrayList<WorkoutHistory>();
		}
	}
	

	public Customer(int membershipId, double points, int customerTypeId) {
		super();
		this.membershipId = membershipId;
		this.points = points;
		this.customerTypeId = customerTypeId;
	}
	

	public Customer(String username, String password, String name, String surname, Gender gender, Date birthDate,
			Role role, boolean isDeleted, int id, int membershipId, double points, int customerTypeId,
			List<Integer> visitedFacilityIds, List<WorkoutHistory> workoutHistory) {
		super(username, password, name, surname, gender, birthDate, role, isDeleted, id);
		this.membershipId = membershipId;
		this.points = points;
		this.customerTypeId = customerTypeId;
		
		this.visitedFacilityIds = visitedFacilityIds;
		if(visitedFacilityIds == null) {
			this.visitedFacilityIds = new ArrayList<Integer>();
		}
		
		this.workoutHistory = workoutHistory;
		if(workoutHistory == null) {
			this.workoutHistory = new ArrayList<WorkoutHistory>();
		}
	}
	/*
	public Customer(String username, String password, String name, String surname, Gender gender, Date birthDate,
			Role role, boolean isDeleted, int id) {
		super(username, password, name, surname, gender, birthDate, role, isDeleted, id);
		// TODO Auto-generated constructor stub
	}*/

	public Customer(String username, String password, String name, String surname, Gender gender, Date birthDate,
			Role role, boolean isDeleted, int id, int membershipId, double points, int customerTypeId) {
		super(username, password, name, surname, gender, birthDate, role, isDeleted, id);
		this.membershipId = membershipId;
		this.points = points;
		this.customerTypeId = customerTypeId;
	}
	
	

	public List<WorkoutHistory> getWorkoutHistory() {
		return workoutHistory;
	}

	public void setWorkoutHistory(List<WorkoutHistory> workoutHistory) {
		this.workoutHistory = workoutHistory;
	}

	public Customer() {
		super();
	}

	public int getMembershipId() {
		return membershipId;
	}
	public void setMembershipId(int membershipId) {
		this.membershipId = membershipId;
	}
	public double getPoints() {
		return points;
	}
	public void setPoints(double points) {
		this.points = points;
	}	
	
	public List<Integer> getVisitedFacilityIds() {
		return visitedFacilityIds;
	}

	public void setVisitedFacilityIds(List<Integer> visitedFacilityIds) {
		this.visitedFacilityIds = visitedFacilityIds;
	}

	public int getCustomerTypeId() {
		return customerTypeId;
	}

	public void setCustomerTypeId(int customerTypeId) {
		this.customerTypeId = customerTypeId;
	}

	public void update(Customer newCustomer) {
		//this.username = newCustomer.username;
		this.password = newCustomer.password;
		this.name = newCustomer.name;
		this.surname = newCustomer.surname;
		this.gender = newCustomer.gender;
		this.birthDate = newCustomer.birthDate;
		//this.role = newCustomer.role;
		//this.isDeleted = newCustomer.isDeleted;
		//this.id = newCustomer.id;
		//this.membershipId = newCustomer.membershipId;
		//this.points = newCustomer.points;
		//this.customerTypeId = newCustomer.customerTypeId;
	}

	public void addVistedFacility(int facilityId) {
		if(!visitedFacilityIds.contains(facilityId)) {
			visitedFacilityIds.add(facilityId);
		}
		
	}
}
