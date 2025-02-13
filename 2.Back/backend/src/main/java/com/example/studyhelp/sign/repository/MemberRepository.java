package com.example.studyhelp.sign.repository;

import com.example.studyhelp.sign.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member,Long> {

    Optional<Member> findMemberByEmailAndAndProvider(String email,String provider);
    Optional<Member> findMemberByEmail(String email);
    Boolean existsMemberByEmailAndProvider(String email,String provider);
}
