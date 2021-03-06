package dto;

import java.util.Date;

import beans.Customer;
import beans.CustomerType;
import beans.Gender;
import beans.Role;
import beans.User;
import dao.CustomerTypeDao;

public class BigDaddy extends Customer{
	private CustomerType customerType;

	public BigDaddy() {
		super();
		// TODO Auto-generated constructor stub
	}
	

	public CustomerType getCustomerType() {
		return customerType;
	}


	public void setCustomerType(CustomerType customerType) {
		this.customerType = customerType;
	}


	public BigDaddy(int membershipId, double points) {
		super(membershipId, points);
		// TODO Auto-generated constructor stub
	}

	public BigDaddy(String username, String password, String name, String surname, Gender gender, Date birthDate,
			Role role, boolean isDeleted, int id, int membershipId, double points, int customerTypeId) {
		super(username, password, name, surname, gender, birthDate, role, isDeleted, id, membershipId, points, customerTypeId);
		// TODO Auto-generated constructor stub
	}
	
	public BigDaddy(User user, double points, int customerTypeId) {
		this.username = user.getUsername();
		this.password = user.getPassword();
		this.name = user.getName();
		this.surname = user.getSurname();
		this.gender = user.getGender();
		this.birthDate = user.getBirthDate();
		this.role = user.getRole();
		this.isDeleted = user.isDeleted();
		this.id = user.getId();
		
		if(user.getRole() == Role.customer) {
			CustomerTypeDao customerTypeDao = new CustomerTypeDao();
			this.customerType = customerTypeDao.getById(customerTypeId);
			System.out.println(this.customerType.getType());
			this.points = points;
			this.customerTypeId = customerTypeId;
		}
		else {
			this.customerTypeId = -1;
			this.customerType = null;
			this.points = -1;
		}
	}
}
